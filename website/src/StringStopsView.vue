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
import type { Note, NoteInput, Stop } from 'string-fingerings'
import {
  parse,
  calculateFingerings,
  hasNoGaps,
  hasPossibleStretch,
  forsythCompatible,
  hasForsythValidation,
  noteName,
  isNote,
  generateNoteCombinations
} from 'string-fingerings'
import InfoOverlay from "@/components/InfoOverlay.vue";

const fingeringsStore = useFingeringStore()
const instrumentsStore = useInstrumentsStore()

const selectedInstrument = ref(0)
const parsedNotes = ref<NoteInput[]>([parse('G3'), parse('D4')])
const validCombinations = ref<Note[][]>([])
const validateNoGaps = ref(true)
const validatePossibleStretch = ref(true)
const validateForsyth = ref(false)
const includeNaturalHarmonics = ref(false)
const showScordatura = ref(false)
const showHighestStops = ref(false)

const instrument = computed(() => instrumentsStore.instruments[selectedInstrument.value])
const stops = computed(() => instrument.value.stops)

watch(instrument, (inst) => {
  if (!hasForsythValidation(inst)) validateForsyth.value = false
})

watch(
  [
    instrument,
    stops,
    parsedNotes,
    validateNoGaps,
    validatePossibleStretch,
    validateForsyth,
    includeNaturalHarmonics
  ],
  ([inst, , rparsedNotes, rvalidateNoGaps, rvalidatePossibleStretch, rvalidateForsyth, rincludeNaturalHarmonics]) => {
    const validations: Function[] = []
    if (rvalidateNoGaps) validations.push(hasNoGaps)
    if (rvalidatePossibleStretch) validations.push(hasPossibleStretch)
    if (hasForsythValidation(inst) && rvalidateForsyth) validations.push(forsythCompatible)

    const minMidi = inst.strings.reduce((prev, curr) => {
      const additional = (curr.additionalOpenSemitones ?? []).map((s) => s + curr.openNote.number)
      return Math.min(prev, curr.openNote.number, ...additional)
    }, Infinity)
    const maxMidi = inst.strings.reduce(
      (prev, curr) => Math.max(prev, curr.openNote.number + (curr.stops ?? inst.stops)),
      0
    )

    const combinations = generateNoteCombinations(rparsedNotes, minMidi, maxMidi)
    const allFingerings: Stop[][] = []
    const validCombos: Note[][] = []

    for (const combo of combinations) {
      const fingerings = calculateFingerings(
        inst,
        combo.map((n) => n.number),
        validations,
        rincludeNaturalHarmonics
      )
      if (fingerings.length > 0) {
        validCombos.push(combo)
        allFingerings.push(...fingerings)
      }
    }

    validCombinations.value = validCombos
    fingeringsStore.loadFingerings(allFingerings)
  }, { deep: true }
)
</script>

<template>
  <div class="flex flex-col h-full pl-4">
    <div class="flex-auto basis-96 flex flex-row overflow-hidden">
      <div class="flex-initial basis-1/2 p-4 text-wrap overflow-y-auto">
        <h2 class="view-title">String Stops</h2>
        <div>
          <div class="flex flex-row flex-wrap items-end gap-4">
            <div>
              <label for="instrument" class="font-bold text-gray-500">Instrument</label>
              <InstrumentSelector
id="instrument" v-model="selectedInstrument" name="instrument"
                class="shadow w-full border py-1.5 pl-1" />
            </div>
            <div>
              <label for="notes" class="font-bold text-gray-500">Notes <InfoOverlay>
                  <p class="mb-3">Introduce one or more notes, separated by spaces.</p>
                  <p class="mb-3">Each note has a note letter (case-insensitive), an optional alteration and an optional
                    octave number.</p>
                  <p class="mb-3">Valid alterations are: #, b, x and bb.</p>
                  <p class="mb-3">The middle C is C4.</p>
                  <p class="mb-3">If the octave is omitted (e.g. "C" or "C#"), all valid octave combinations within the
                    instrument's range will be shown.</p>
                  <p class="mb-3">You can also use a MIDI keyboard to input the notes. <strong>Please focus on the input
                      box before playing the notes.</strong></p>
                </InfoOverlay></label>
              <NotesInput
id="notes" v-model="parsedNotes" :max-notes="instrument.strings.length" placeholder="C5 G5"
                class="shadow border bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
            </div>
            <div class="relative">
              <button
class="shadow border-red-900 bg-red-800 rounded-full font-bold text-white py-2 px-3"
                @click="showScordatura = !showScordatura">Scordatura {{ showScordatura ? "▲" : "▼" }}</button>
              <div v-show="showScordatura" class="p-3 absolute shadow-xl border bg-white z-[900]">
                <div v-for="(string, index) in instrument.strings" :key="index" class="mb-2">
                  <label for="notes" class="font-bold text-gray-500">Open string {{ index + 1 }} <InfoOverlay>
                      <p class="mb-3">Introduce one note.</p>
                      <p class="mb-3">The note has a note letter (case-insensitive), an optional alteration and an
                        octave number.</p>
                      <p class="mb-3">Valid alterations are: #, b, x and bb.</p>
                      <p class="mb-3">The middle C is C4.</p>
                      <p class="mb-3">You can also use a MIDI keyboard to input the note. <strong>Please focus on the
                          input box before playing the notes.</strong></p>
                    </InfoOverlay></label>
                  <NotesInput
id="notes" :model-value="[string.openNote]" :max-notes="1" placeholder="C5"
                    class="shadow border bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    @update:model-value="notes => { if (notes && notes[0] && isNote(notes[0])) instrumentsStore.changeOpenNote(selectedInstrument, index, notes[0]) }" />
                </div>
              </div>
            </div>
            <div class="relative">
              <button
class="shadow border-red-900 bg-red-800 rounded-full font-bold text-white py-2 px-3"
                @click="showHighestStops = !showHighestStops">Highest stops {{ showHighestStops ? "▲" : "▼" }}</button>
              <div v-show="showHighestStops" class="p-3 absolute shadow-xl border bg-white z-[900]">
                <div v-for="(string, index) in instrument.strings" :key="index" class="mb-2">
                  <label for="notes" class="font-bold text-gray-500">Highest note on string {{ index + 1 }}
                    <InfoOverlay>
                      <p class="mb-3">Introduce one note.</p>
                      <p class="mb-3">The note has a note letter (case-insensitive), an optional alteration and an
                        octave number.</p>
                      <p class="mb-3">Valid alterations are: #, b, x and bb.</p>
                      <p class="mb-3">The middle C is C4.</p>
                      <p class="mb-3">You can also use a MIDI keyboard to input the note. <strong>Please focus on the
                          input box before playing the notes.</strong></p>
                    </InfoOverlay>
                  </label>
                  <NotesInput
id="notes"
                    :model-value="[parse(noteName(string.openNote.number + (string.stops ?? instrument.stops)))]"
                    :max-notes="1" placeholder="C5"
                    class="shadow border bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    @update:model-value="notes => { if (notes && notes[0] && isNote(notes[0])) instrumentsStore.changeHighestNote(selectedInstrument, index, notes[0]) }" />
                </div>
              </div>
            </div>

            <CheckboxBase id="validateNoGaps" v-model="validateNoGaps">No gaps&nbsp;<InfoOverlay>
                <p class="mb-3">If checked, fingerings with gaps (i.e. where at least one string not played in the
                  middle) will be filtered out.</p>
                <p class="mb-3">Fingerings with gaps are typically used for pizzicato playing. When using the bow, they
                  cannot be played without stopping the sound, so they are better written separately, with or without
                  grace notes.</p>
              </InfoOverlay>
            </CheckboxBase>
            <CheckboxBase id="validatePossibleStretch" v-model="validatePossibleStretch">Discard impossible
              fingerings&nbsp;<InfoOverlay>
                <p class="mb-3">This discard some impossible fingerings. The algorithm is simple so it cannot discard
                  all of them.</p>
                <p class="mb-3">Currently, it discards the fingering if it has stretches greater than
                  ${{ instrument.maxStretch }}mm between contiguous strings. It also checks that the stretch between the
                  highest and the lowest stop cannot be greater than {{ instrument.maxStretch * 1.02 }}mm.</p>
              </InfoOverlay>
            </CheckboxBase>
            <CheckboxBase
              v-if="hasForsythValidation(instrument)"
              id="validateForsyth"
              v-model="validateForsyth"
            >Forsyth (1914)&nbsp;<InfoOverlay>
              <p class="mb-3">
                Filter fingerings using conservative rules from Cecil Forsyth’s
                <a
                  class="text-blue-700 underline"
                  href="https://imslp.org/wiki/Orchestration_(Forsyth,_Cecil)"
                  target="_blank"
                  rel="noopener noreferrer"
                >Orchestration</a>
                (violin double stops in this version). Natural harmonics are not checked.
              </p>
            </InfoOverlay>
            </CheckboxBase>
            <CheckboxBase id="includeNaturalHarmonics" v-model="includeNaturalHarmonics">Natural harmonics&nbsp;
              <InfoOverlay>
                <p class="mb-3">If checked, fingerings with natural harmonics will be included.</p>
              </InfoOverlay>
            </CheckboxBase>
          </div>
        </div>
        <ScoreDisplay
:note-groups="validCombinations.map(combo => combo.map(note => ({ note, harmonic: false })))"
          :instrument="selectedInstrument" />
        <FingeringsDescription :instrument="instrument" />
      </div>
      <div class="flex-auto border-l-2 border-l-gray-300 border-b-2 border-b-gray-300">
        <StopsDiagram class="max-h-full mx-auto" :instrument-index="selectedInstrument" />
      </div>
    </div>
  </div>
</template>
