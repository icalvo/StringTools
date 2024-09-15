<script setup lang="ts">
import { type Instrument, instruments } from '@/data/instruments'
import { renderAbc } from 'abcjs'
import { useTemplateRef, watch } from 'vue'

const props = defineProps<{
  notes: Array<number> | null
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

<style scoped></style>
