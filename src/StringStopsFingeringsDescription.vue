<script setup lang="ts">
import type {Instrument} from '@/data/instruments'
import {computed} from 'vue'
import {fingeringColor} from '@/data/presentation'
import {useFingeringStore} from "@/stores/fingeringsStore";

const props = defineProps<{
  instrument: Instrument
}>()

const fingeringsStore = useFingeringStore()

const data = computed(() =>
    fingeringsStore.fingeringToggles.map((fingeringToggle, fingeringIndex) => ({
      color: fingeringColor(fingeringsStore.fingeringToggles.length, fingeringIndex),
      fingeringNumber: fingeringIndex + 1,
      enabled: fingeringToggle.enabled,
      stops: fingeringToggle.fingering.map((stop) => {
        const stringName = props.instrument.strings[stop.stringIndex].name
        return ({
          stringName,
          stopDesc:
              stop.stopIndex === 0
                  ? `Open ${stringName} string`
                  : stop.naturalHarmonic
                      ? `Touch ${stringName} string at ${stop.stopIndex} (natural harmonic)`
                      : `Stop ${stringName} string at ${stop.stopIndex}`,
          stretch: 'stopPosDiff' in stop ? Math.floor(stop.stopPosDiff as number) + 'mm' : ''
        });
      })
    }))
)

function toggleAll(enabled: boolean) {
  [...Array(data.value.length).keys()].forEach(index => 
    fingeringsStore.toggleFingering(index, enabled))
}
</script>

<template>
  <div>
    <span v-if="data.length > 1" class="checkbox-wrapper-2">
      <input
          type="checkbox" :checked="true" :style="{'--bgColor': 'gray'}"
          @input.prevent.stop="event => toggleAll((event.target as HTMLInputElement).checked)"/>
      All
    </span>
    <div v-if="data.length > 0" class="flex flex-row flex-wrap">
      <div v-for="(f, index) in data" :key="index" class="flex-initial basis-1/5 border-2 border-gray-300 rounded-2xl shadow-md p-2">
        <h2 class="text-xl">
          <span class="checkbox-wrapper-2">
            <input
    type="checkbox" :checked="f.enabled" :style="{'--bgColor': f.color}"
                   @input.prevent.stop="event => fingeringsStore.toggleFingering(index, (event.target as HTMLInputElement).checked)"/>
          </span>
    
          Fingering {{ f.fingeringNumber }}</h2>
        <ul class="p-4">
          <li v-for="(s, sindex) in f.stops" :key="sindex" class="list-disc">
            {{ s.stopDesc }} {{ s.stretch }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="data.length === 0">No fingerings found.</div>
  </div>
</template>

<style scoped>
html {
  --bgColor: black;
}

.checkbox-wrapper-2 input {
  appearance: none;
  background-color: #dfe1e4;
  border-radius: 72px;
  border-style: none;
  flex-shrink: 0;
  height: 20px;
  margin: 0;
  position: relative;
  width: 30px;
}

.checkbox-wrapper-2 input::before {
  bottom: -6px;
  content: "";
  left: -6px;
  position: absolute;
  right: -6px;
  top: -6px;
}

.checkbox-wrapper-2 input,
.checkbox-wrapper-2 input::after {
  transition: all 100ms ease-out;
}

.checkbox-wrapper-2 input::after {
  background-color: #fff;
  border-radius: 50%;
  content: "";
  height: 14px;
  left: 3px;
  position: absolute;
  top: 3px;
  width: 14px;
}

.checkbox-wrapper-2 input[type=checkbox] {
  cursor: default;
}

.checkbox-wrapper-2 input:hover {
  background-color: #c9cbcd;
  transition-duration: 0s;
}

.checkbox-wrapper-2 input:checked {
  background-color: var(--bgColor);
}

.checkbox-wrapper-2 input:checked::after {
  background-color: #fff;
  left: 13px;
}

.checkbox-wrapper-2 :focus:not(.focus-visible) {
  outline: 0;
}

.checkbox-wrapper-2 input:checked:hover {
  background-color: color-mix(in srgb, var(--bgColor), black 20%);
}
</style>
