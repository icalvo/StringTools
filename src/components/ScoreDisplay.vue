<script setup lang="ts">
import { type Instrument } from '@/packages/string-fingerings'
import { renderAbc } from 'abcjs'
import { useTemplateRef, watch } from 'vue'
import { useInstrumentsStore } from "@/stores/instrumentsStore";

const instrumentsStore = useInstrumentsStore()
const instruments = instrumentsStore.instruments

const props = defineProps<{
  notes: number[] | null
  instrumentIndex: number
}>()
function abcnote(noteNumber: number): string {
  const noteIndex = noteNumber % 12
  let noteName = ['c', 'c', 'd', 'd', 'e', 'f', 'f', 'g', 'g', 'a', 'a', 'b'][noteIndex]
  const alteration = ['', '^', '', '^', '', '', '^', '', '^', '', '^', ''][noteIndex]
  const octave = Math.floor(noteNumber / 12)
  let ticks: number
  if (octave <= 4) {
    noteName = noteName.toUpperCase()
    ticks = 4 - octave
    return `${alteration}${noteName}${','.repeat(ticks)}`
  } else {
    ticks = octave - 5
    return `${alteration}${noteName}${"'".repeat(ticks)}`
  }
}

function showScore(target: HTMLElement, notes: number[], instrument: Instrument) {
  const lowestNote = instrument.strings.reduce((prev, curr) => Math.min(prev, curr.openNote), 1000)
  const highestNote = instrument.strings.reduce(
    (prev, curr) => Math.max(prev, curr.openNote + instrument.stops),
    0
  )
  if (notes.some((note) => note < lowestNote || note > highestNote)) {
    notes = []
  }

  const abcnotes = notes.map((n) => `${abcnote(n)}2`).join('')
  const score = `X:1/4\nK:C ${instrument.clef}\n[${abcnotes}]`
  const visualOptions = {
    scale: 2,
    visualTranspose: instrument.transposition ?? 0
  }

  renderAbc(target, score, visualOptions)
}

function show() {
  if (score.value === null) return
  if (props.notes !== null) showScore(score.value, props.notes, instruments[props.instrumentIndex])
  else showScore(score.value, [], instruments[props.instrumentIndex])
}

const score = useTemplateRef('score')

watch(() => props.notes, show)
watch(() => props.instrumentIndex, show)
</script>

<template>
  <div ref="score"></div>
</template>
