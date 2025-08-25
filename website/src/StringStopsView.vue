<script setup lang="ts">
import StopsDiagram from '@/StringStopsDiagram.vue'
import { computed, ref, watch } from 'vue'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import NotesInput from '@/components/NotesInput.vue'
import InstrumentSelector from '@/components/InstrumentSelector.vue'
import FingeringsDescription from '@/StringStopsFingeringsDescription.vue'
import { useFingeringStore } from '@/stores/fingeringsStore'
import CheckboxBase from '@/components/CheckboxBase.vue'
import { useInstrumentsStore } from '@/stores/instrumentsStore'
import { parse, calculateFingerings, hasNoGaps, hasPossibleStretch } from 'string-fingerings'

const fingeringsStore = useFingeringStore()
const instrumentsStore = useInstrumentsStore()

const selectedInstrument = ref(0)
const parsedNotes = ref([parse('G3'), parse('D4')])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)
const includeNaturalHarmonics = ref(false)

const instrument = computed(() => instrumentsStore.instruments[selectedInstrument.value])
const stops = computed(() => instrument.value.stops)

watch(
  [
    instrument,
    stops,
    parsedNotes,
    validateNoGaps,
    validatePossibleStretch,
    includeNaturalHarmonics
  ],
  ([inst, , rparsedNotes, rvalidateNoGaps, rvalidatePossibleStretch, rincludeNaturalHarmonics]) => {
    const validations = []
    if (rvalidateNoGaps) validations.push(hasNoGaps)
    if (rvalidatePossibleStretch) validations.push(hasPossibleStretch)

    const newFingerings = calculateFingerings(
      inst,
      rparsedNotes.map((n) => n.number) as number[],
      validations,
      rincludeNaturalHarmonics
    )
    fingeringsStore.loadFingerings(newFingerings)
  }
)
</script>

<template>
  <div class="flex flex-col h-full pl-4">
    <div class="flex-auto basis-96 flex flex-row overflow-hidden">
      <div class="flex-initial basis-1/2 p-4 text-wrap overflow-y-auto">
        <h2 class="view-title">String Stops</h2>
        <div>
          <div class="flex flex-row flex-wrap items-center gap-4">
            <div>
              <label for="instrument" class="font-bold text-gray-500">Instrument</label>
              <InstrumentSelector
                id="instrument"
                v-model="selectedInstrument"
                name="instrument"
                class="shadow w-full border py-1.5 pl-1"
              />
            </div>
            <div>
              <label for="notes" class="font-bold text-gray-500">Notes</label>
              <NotesInput
                id="notes"
                v-model="parsedNotes"
                placeholder="C5 G5"
                class="shadow border bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label for="stops" class="font-bold text-gray-500"
                >Available semitones from open string</label
              >
              <input
                id="stops"
                type="number"
                :value="instrument.stops"
                class="shadow border w-full bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                @input="
                  (event) =>
                    instrumentsStore.changeStops(
                      selectedInstrument,
                      (event.target as HTMLInputElement).valueAsNumber
                    )
                "
              />
            </div>
            <CheckboxBase
              id="validateNoGaps"
              v-model="validateNoGaps"
              label="No gaps"
              title="If checked, fingerings with gaps (i.e. where at least one string in the middle has to be skipped) will be filtered out. Tick this if you want plain multiple-stops."
            />
            <CheckboxBase
              id="validatePossibleStretch"
              v-model="validatePossibleStretch"
              label="Discard impossible stretches"
              :title="`Check to discard impossible stretches for the selected instrument (${instrument.maxStretch}mm)`"
            />
            <CheckboxBase
              id="includeNaturalHarmonics"
              v-model="includeNaturalHarmonics"
              label="Natural harmonics"
              title="If checked, fingerings with natural harmonics will be included."
            />
          </div>
        </div>
        <ScoreDisplay
          :notes="parsedNotes.map((note) => ({ note, harmonic: false }))"
          :instrument="selectedInstrument"
        />
        <FingeringsDescription :instrument="instrument" />
      </div>
      <div class="flex-auto">
        <StopsDiagram
          class="max-h-full mx-auto border-l-2 border-l-gray-300 border-b-2 border-b-gray-300"
          :instrument-index="selectedInstrument"
        />
      </div>
    </div>
  </div>
</template>
