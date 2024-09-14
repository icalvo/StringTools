<script setup lang="ts">
import StopsDiagram from '@/components/StopsDiagram.vue'
import {computed, ref} from "vue";
import {instruments} from "@/data/instruments";
import {calculateFingerings, hasNoGaps, hasPossibleStretch, noteNumber} from "@/data/fingerings";

const selectedInstrument = ref(0)
const options = ref(instruments.map((instrument, i) => ({ text: instrument.name, value: i })))
const notes = ref('G3 D4')
const computedNotes = computed(() => {
  const noteNumbers = notes.value
      .split(" ")
      .map(noteName => ({noteName, noteNumber: noteNumber(noteName)}))

  for (const result of noteNumbers) {
    if (typeof result.noteNumber === 'string') {
      for (const r2 of noteNumbers.filter(r => typeof r.noteNumber === 'string')) {
        console.log(`${r2.noteName} is invalid: ${r2.noteNumber}`)
      }

      return null
    }
  }

  if (noteNumbers.length < 2) {
    console.log("I need at least two notes")
    return null
  }

  return noteNumbers.map(r => r.noteNumber).filter(f => typeof f === 'number')
})
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)

const fingerings = computed(() => {
  const notes = computedNotes
  if (notes.value === null) return null
  const instrument = instruments[selectedInstrument.value]
  const validations = []
  if (validateNoGaps.value) validations.push(hasNoGaps)
  if (validatePossibleStretch.value) validations.push(hasPossibleStretch)
  return calculateFingerings(
      instrument,
      notes.value, 
      validations);
})
</script>

<template>
  <h2>String Stops</h2>
  <div class="flex flex-row p-4 border-2 border-red-500">
    <div class="flex-grow">
      <label for="instrument">Instrument</label>

      <select id="instrument" name="instrument" v-model="selectedInstrument" class="border-2 py-1.5 pl-1">
        <option v-for="option in options" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <label for="notes">Notes</label>
      <input type="text" id="notes" name="notes" v-model="notes" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
      <label for="hasNoGaps">No gaps</label>
      <input type="checkbox" id="hasNoGaps" name="hasNoGaps" v-model="validateNoGaps" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
      <label for="hasNoGaps">Discard impossible stretches</label>
      <input type="checkbox" id="hasPossibleStretch" name="hasPossibleStretch" v-model="validatePossibleStretch" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
      <div id="score"></div>
      <div id="description"></div>
      <div>{{ computedNotes }}</div>
    </div>
  </div>

  <StopsDiagram :fingerings="fingerings" :instrument-index="selectedInstrument" />
</template>
