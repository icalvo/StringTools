<script setup lang="ts">
import { computed } from 'vue'
import { fingeringColor } from '@/data/presentation'
import { useFingeringStore } from '@/stores/fingeringsStore'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import ToggleBase from '@/components/ToggleBase.vue'
import type { UiInstrument } from '@/stores/instrumentsStore'
import { parse, noteName } from 'string-fingerings'

const props = defineProps<{
  instrument: UiInstrument
}>()

const fingeringsStore = useFingeringStore()
const data = computed(() =>
  fingeringsStore.fingeringToggles.map((fingeringToggle, fingeringIndex) => ({
    color: fingeringColor(fingeringsStore.fingeringToggles.length, fingeringIndex),
    fingeringNumber: fingeringIndex + 1,
    enabled: fingeringToggle.enabled,
    hasHarmonics: fingeringToggle.fingering.some((s) => s.naturalHarmonic),
    stops: fingeringToggle.fingering.map((stop) => {
      const stringName = props.instrument.strings[stop.stringIndex].name
      return {
        stringName,
        note: stop.noteNumber,
        isHarmonic: stop.naturalHarmonic,
        stopDesc:
          stop.stopIndex === 0
            ? `Open ${stringName} string`
            : stop.naturalHarmonic
              ? `Touch ${stringName} string at ${stop.stopIndex} (natural harmonic)`
              : `Stop ${stringName} string at ${stop.stopIndex}`,
        stretch: 'stopPosDiff' in stop ? Math.floor(stop.stopPosDiff as number) + 'mm' : ''
      }
    })
  }))
)

function toggleAll(enabled: boolean|undefined) {
  ;[...Array(data.value.length).keys()].forEach((index) =>
    fingeringsStore.toggleFingering(index, enabled ?? false)
  )
}
</script>

<template>
  <div>
    <div class="mb-2">
      <ToggleBase id="toggleAll" color="gray" :input="true" class="mb-2" @update:input="toggleAll"
        >Toggle all</ToggleBase
      >
    </div>
    <div v-if="data.length > 0" class="flex flex-row flex-wrap">
      <div
        v-for="(f, index) in data"
        :key="index"
        class="flex-initial basis-1/5 border-2 border-gray-300 rounded-2xl shadow-md p-2"
      >
        <div>
          <ToggleBase
            :id="`fingering${index + 1}`"
            :color="f.color"
            :input="f.enabled"
            @update:input="(event) => fingeringsStore.toggleFingering(index, event)"
          >
            <h2 class="text-xl">Fingering {{ f.fingeringNumber }}</h2>
          </ToggleBase>

          <ul class="p-4">
            <li v-for="(s, sindex) in f.stops" :key="sindex" class="list-disc text-xs">
              {{ s.stopDesc }} {{ s.stretch }}
            </li>
          </ul>
        </div>
<!--        <div>-->
<!--          <ScoreDisplay-->
<!--            v-if="f.hasHarmonics"-->
<!--            :notes="f.stops.map((s) => ({ note: parse(noteName(s.note)), harmonic: s.isHarmonic }))"-->
<!--            :instrument="instrument"-->
<!--            :scale="1"-->
<!--          />-->
<!--        </div>-->
      </div>
    </div>
    <div v-if="data.length === 0">No fingerings found.</div>
  </div>
</template>

<style scoped></style>
