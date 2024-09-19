<script setup lang="ts">
import StopsDiagram from '@/components/StopsDiagram.vue'
import {computed, ref, watch} from 'vue'
import { instruments } from '@/data/instruments'
import { calculateFingerings, hasNoGaps, hasPossibleStretch } from '@/data/fingerings'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import NoteInput from '@/components/NotesInput.vue'
import InstrumentSelector from '@/components/InstrumentSelector.vue'
import FingeringsDescription from '@/components/FingeringsDescription.vue'
import {useFingeringStore} from "@/stores/fingerings";

const fingeringsStore = useFingeringStore()

const selectedInstrument = ref(0)
const parsedNotes = ref([55, 62])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)
const instrument = computed(() => instruments[selectedInstrument.value])


watch(parsedNotes, notes => {
  const validations = []
  if (validateNoGaps.value) validations.push(hasNoGaps)
  if (validatePossibleStretch.value) validations.push(hasPossibleStretch)
  fingeringsStore.loadFingerings(calculateFingerings(instrument.value, notes, validations, false))
})

</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="flex-initial text-3xl">String Stops</h2>
    <div class="flex-auto basis-96 flex flex-row overflow-hidden">
      <div class="flex-initial basis-1/2 flex flex-col p-4 text-wrap">
        <div>
          <label for="instrument">Instrument</label>
          <InstrumentSelector
            id="instrument"
            v-model="selectedInstrument"
            name="instrument"
            class="border-2 py-1.5 pl-1"
          />
          <label for="notes" class="px-1">Notes</label>
          <NoteInput
            v-model="parsedNotes"
            name="notes"
            class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="C5 G5"
          />
          <label for="hasNoGaps" class="px-1">No gaps</label>
          <input
            v-model="validateNoGaps"
            type="checkbox"
            name="hasNoGaps"
            class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
          <label for="hasPossibleStretch" class="px-1">Discard impossible stretches</label>
          <input
            v-model="validatePossibleStretch"
            type="checkbox"
            name="hasPossibleStretch"
            class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
        <ScoreDisplay :notes="parsedNotes" :instrument-index="selectedInstrument" />
        <FingeringsDescription :instrument="instrument" />
      </div>
      <div class="flex-auto">
        <StopsDiagram
          class="max-h-full mx-auto"
          :instrument-index="selectedInstrument"
        />
      </div>
    </div>
  </div>
</template>
