<script setup lang="ts">
import StopsDiagram from '@/components/StopsDiagram.vue'
import {computed, ref} from "vue";
import {instruments} from "@/data/instruments";
import {calculateFingerings, hasNoGaps, hasPossibleStretch, noteNumber} from "@/data/fingerings";
import Score from "@/components/Score.vue";
import NoteInput from "@/components/NotesInput.vue";
import InstrumentSelector from "@/components/InstrumentSelector.vue";

const selectedInstrument = ref(0)
const parsedNotes = ref([43, 50])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)

const fingerings = computed(() => {
  const notes = parsedNotes.value
  if (notes.length < 2) {
    console.log("I need at least two notes")
    return []
  }

  const instrument = instruments[selectedInstrument.value]
  const validations = []
  if (validateNoGaps.value) validations.push(hasNoGaps)
  if (validatePossibleStretch.value) validations.push(hasPossibleStretch)
  return calculateFingerings(
      instrument,
      notes, 
      validations);
})
</script>

<template>
  <h2>String Stops</h2>
  <div class="flex flex-row p-4 border-2 border-red-500">
    <div class="flex-grow">
      <label for="instrument">Instrument</label>
      <InstrumentSelector id="instrument" name="instrument" v-model="selectedInstrument" class="border-2 py-1.5 pl-1" />
      <label for="notes">Notes</label>
      <NoteInput id="notes" name="notes" v-model="parsedNotes" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
      <label for="hasNoGaps">No gaps</label>
      <input type="checkbox" id="hasNoGaps" name="hasNoGaps" v-model="validateNoGaps" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
      <label for="hasNoGaps">Discard impossible stretches</label>
      <input type="checkbox" id="hasPossibleStretch" name="hasPossibleStretch" v-model="validatePossibleStretch" class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="C5 G5" />
      <Score :notes="parsedNotes" :instrument-index="selectedInstrument" />
      <div id="description"></div>
      <div>{{ parsedNotes }}</div>
    </div>
  </div>

  <StopsDiagram :fingerings="fingerings" :instrument-index="selectedInstrument" />
</template>
