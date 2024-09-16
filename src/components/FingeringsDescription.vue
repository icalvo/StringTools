<script setup lang="ts">
import type { Stop } from '@/data/types'
import type { Instrument } from '@/data/instruments'
import { computed } from 'vue'
import { fingeringColor } from '@/data/presentation'

const props = defineProps<{
  fingerings: Stop[][]
  instrument: Instrument
}>()

const data = computed(() =>
  props.fingerings.map((fingering, fingeringIndex) => ({
    color: fingeringColor(fingeringIndex),
    fingeringNumber: fingeringIndex + 1,
    stops: fingering.map((stop) => ({
      stringName: props.instrument.strings[stop.stringIndex].name,
      stopDesc: stop.stopIndex === 0 ? 'open string' : `string at stop ${stop.stopIndex}`,
      stretch: 'stopPosDiff' in stop ? Math.floor(stop.stopPosDiff as number) + 'mm' : ''
    }))
  }))
)
</script>

<template>
  <div v-for="(f, index) in data" :key="index">
    <h2 class="text-xl" :style="{ backgroundColor: f.color }">Fingering {{ f.fingeringNumber }}</h2>
    <ul class="p-4">
      <li v-for="(s, index) in f.stops" :key="index" class="list-disc">
        {{ s.stringName }} {{ s.stopDesc }} {{ s.stretch }}
      </li>
    </ul>
  </div>
  <div v-if="fingerings.length === 0">No fingerings found.</div>
</template>

<style scoped></style>
