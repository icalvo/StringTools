<script setup lang="ts">
import StopsDiagram from '@/StringStopsDiagram.vue'
import {computed, ref, watch} from 'vue'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import NoteInput from '@/components/NotesInput.vue'
import InstrumentSelector from '@/components/InstrumentSelector.vue'
import FingeringsDescription from '@/StringStopsFingeringsDescription.vue'
import {useFingeringStore} from "@/stores/fingeringsStore";
import CheckboxBase from "@/components/CheckboxBase.vue";
import {useInstrumentsStore} from "@/stores/instrumentsStore";
import {calculateFingerings, hasNoGaps, hasPossibleStretch} from "string-fingerings";

const fingeringsStore = useFingeringStore()
const instrumentsStore = useInstrumentsStore()

const selectedInstrument = ref(0)
const parsedNotes = ref([55, 62])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)
const includeNaturalHarmonics = ref(false)

const instrument = computed(() => instrumentsStore.instruments[selectedInstrument.value])
const stops = computed(() => instrument.value.stops)

watch([instrument, stops, parsedNotes, validateNoGaps, validatePossibleStretch, includeNaturalHarmonics],
    ([inst, , rparsedNotes, rvalidateNoGaps, rvalidatePossibleStretch, rincludeNaturalHarmonics]) => {
      const validations = []
      if (rvalidateNoGaps) validations.push(hasNoGaps)
      if (rvalidatePossibleStretch) validations.push(hasPossibleStretch)

      const newFingerings = calculateFingerings(inst, rparsedNotes, validations, rincludeNaturalHarmonics);
      fingeringsStore.loadFingerings(newFingerings)
    })

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-auto basis-96 flex flex-row overflow-hidden">
      <div class="flex-initial basis-1/2 p-4 text-wrap overflow-y-auto border-r-2 border-gray-300">
        <h2 class="view-title">String Stops</h2>
        <div>
          <div class="flex flex-row flex-wrap">
            <div>
              <label for="instrument">Instrument</label>
              <InstrumentSelector
                  id="instrument"
                  v-model="selectedInstrument"
                  name="instrument"
                  class="border-2 py-1.5 pl-1"
              />
            </div>
            <div>
              <label for="notes" class="px-1">Notes</label>
              <NoteInput
                  id="notes"
                  v-model="parsedNotes"
                  placeholder="C5 G5"
                  class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label for="stops" class="px-1">Available semitones from open string</label>
              <input
id="stops" type="number" :value="instrument.stops"
                     class="flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                     @input="event => instrumentsStore.changeStops(selectedInstrument, (event.target as HTMLInputElement).valueAsNumber)"/>
            </div>
            <CheckboxBase id="validateNoGaps" v-model="validateNoGaps" label="No gaps" class="pr-3"/>
            <CheckboxBase
id="validatePossibleStretch" v-model="validatePossibleStretch"
                          label="Discard impossible stretches" class="pr-3"/>
            <CheckboxBase id="includeNaturalHarmonics" v-model="includeNaturalHarmonics" label="Natural harmonics"/>
          </div>
        </div>
        <ScoreDisplay :notes="parsedNotes.map(note => ({note, harmonic:false}))" :instrument="selectedInstrument"/>
        <FingeringsDescription :instrument="instrument"/>
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
