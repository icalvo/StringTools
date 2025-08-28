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
import InfoOverlay from "@/components/InfoOverlay.vue";

const fingeringsStore = useFingeringStore()
const instrumentsStore = useInstrumentsStore()

const selectedInstrument = ref(0)
const parsedNotes = ref([parse('G3'), parse('D4')])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)
const includeNaturalHarmonics = ref(false)
const showScordatura = ref(false)

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
  }, {deep: true}
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
              <label for="notes" class="font-bold text-gray-500">Notes <InfoOverlay>
                <p class="mb-3">Introduce one or more notes, separated by spaces.</p>
                <p class="mb-3">Each note has a note letter (case-insensitive), an optional alteration and an octave number.</p>
                <p class="mb-3">Valid alterations are: #, b, x and bb.</p>
                <p class="mb-3">The middle C is C4.</p>
                <p class="mb-3">You can also use a MIDI keyboard to input the notes. <strong>Please focus on the input box before playing the notes.</strong></p>
              </InfoOverlay></label>
              <NotesInput
                id="notes"
                v-model="parsedNotes"
                :max-notes="instrument.strings.length"
                placeholder="C5 G5"
                class="shadow border bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="relative">
              <button class="shadow border-red-900 bg-red-800 rounded-full font-bold text-white p-2" @click="showScordatura = !showScordatura">Scordatura {{showScordatura ? "▲" : "▼"}}</button>
              <div v-show="showScordatura" class="p-3 absolute shadow-xl border bg-white z-[900]">
                <div v-for="(string, index) in instrument.strings" :key="index" class="mb-2">
                  <label for="notes" class="font-bold text-gray-500">Open string {{index+1}} <InfoOverlay>
                    <p class="mb-3">Introduce one note.</p>
                    <p class="mb-3">The note has a note letter (case-insensitive), an optional alteration and an octave number.</p>
                    <p class="mb-3">Valid alterations are: #, b, x and bb.</p>
                    <p class="mb-3">The middle C is C4.</p>
                    <p class="mb-3">You can also use a MIDI keyboard to input the note. <strong>Please focus on the input box before playing the notes.</strong></p>
                  </InfoOverlay></label>
                  <NotesInput
                      id="notes"
                      :model-value="[string.openNote]"
                      :max-notes="1"
                      placeholder="C5"
                      class="shadow border bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      @update:model-value="notes => { if (notes && notes[0]) instrumentsStore.changeOpenNote(selectedInstrument, index, notes[0]) }"
                  />
                </div>
              </div>
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
            >No gaps&nbsp;<InfoOverlay>
              <p class="mb-3">If checked, fingerings with gaps (i.e. where at least one string not played in the middle) will be filtered out.</p>
              <p class="mb-3">Fingerings with gaps are typically used for pizzicato playing. When using the bow, they cannot be played without stopping the sound, so they are better written separately, with or without grace notes.</p>
            </InfoOverlay></CheckboxBase>
            <CheckboxBase
              id="validatePossibleStretch"
              v-model="validatePossibleStretch"
            >Discard impossible fingerings&nbsp;<InfoOverlay>
              <p class="mb-3">This discard some impossible fingerings. The algorithm is simple so it cannot discard all of them.</p>
              <p class="mb-3">Currently, it discards the fingering if it has stretches greater than ${{instrument.maxStretch}}mm between contiguous strings. It also checks that the stretch between the highest and the lowest stop cannot be greater than {{instrument.maxStretch * 1.02}}mm.</p>
            </InfoOverlay></CheckboxBase>
            <CheckboxBase
              id="includeNaturalHarmonics"
              v-model="includeNaturalHarmonics"
            >Natural harmonics&nbsp;<InfoOverlay>
              <p class="mb-3">If checked, fingerings with natural harmonics will be included.</p>
            </InfoOverlay></CheckboxBase>
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
