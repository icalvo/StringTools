<script setup lang="ts">
import StopsDiagram from '@/components/StopsDiagram.vue'
import { computed, ref } from 'vue'
import { instruments } from '@/data/instruments'
import { calculateFingerings, hasNoGaps, hasPossibleStretch } from '@/data/fingerings'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import NoteInput from '@/components/NotesInput.vue'
import InstrumentSelector from '@/components/InstrumentSelector.vue'
import FingeringsDescription from '@/components/FingeringsDescription.vue'

const selectedInstrument = ref(0)
const parsedNotes = ref([43, 50])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)
const instrument = computed(() => instruments[selectedInstrument.value])
const fingerings = computed(() => {
  const notes = parsedNotes.value
  const validations = []
  if (validateNoGaps.value) validations.push(hasNoGaps)
  if (validatePossibleStretch.value) validations.push(hasPossibleStretch)
  return calculateFingerings(instrument.value, notes, validations)
})
</script>

<template>
  <div class="flex-auto flex flex-col">
    <h2 class="text-3xl">String Stops</h2>
    <div
      class="flex-auto border-2 border-amber-500"
      style="display: grid; grid-template-columns: 1fr 2fr"
    >
      <div class="flex flex-col p-4 border-2 border-red-500 text-wrap">
        <div>
          <label for="instrument">Instrument</label>
          <InstrumentSelector
            id="instrument"
            name="instrument"
            v-model="selectedInstrument"
            class="border-2 py-1.5 pl-1"
          />
          <label for="notes" class="px-1">Notes</label>
          <NoteInput
            id="notes"
            name="notes"
            v-model="parsedNotes"
            class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="C5 G5"
          />
          <label for="hasNoGaps" class="px-1">No gaps</label>
          <input
            type="checkbox"
            id="hasNoGaps"
            name="hasNoGaps"
            v-model="validateNoGaps"
            class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="C5 G5"
          />
          <label for="hasNoGaps" class="px-1">Discard impossible stretches</label>
          <input
            type="checkbox"
            id="hasPossibleStretch"
            name="hasPossibleStretch"
            v-model="validatePossibleStretch"
            class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="C5 G5"
          />
        </div>
        <ScoreDisplay :notes="parsedNotes" :instrument-index="selectedInstrument" />
        <FingeringsDescription :fingerings="fingerings" :instrument="instrument" />
      </div>
      <div class="border-2 border-blue-400">
        <StopsDiagram
          class="border-2 border-green-400"
          style="max-height: 60vh"
          :fingerings="fingerings"
          :instrument-index="selectedInstrument"
        />
      </div>
    </div>
  </div>
</template>
