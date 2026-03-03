<script setup lang="ts">
import type { Note } from 'string-fingerings'
import { renderAbc } from 'abcjs'
import {computed, useTemplateRef, watch} from 'vue'
import { type UiInstrument, useInstrumentsStore } from '@/stores/instrumentsStore'

const instrumentsStore = useInstrumentsStore()
const instruments = instrumentsStore.instruments


const props = withDefaults(
    defineProps<{
      noteGroups: {note:Note,harmonic:boolean}[][] | null
      instrument: number | UiInstrument
      scale?: number
    }>(),
    { scale: 2 })

const score = useTemplateRef('score')

const instrument = computed(() => 
    typeof props.instrument === "number"
    ? instruments[props.instrument]
    : props.instrument)

function showScore(target: HTMLElement, noteGroups: {note:Note,harmonic:boolean}[][], instrument: UiInstrument) {
  const lowestNote = instrument.strings.reduce((prev, curr) => {
    const additionalOpenSemitones = curr.additionalOpenSemitones ?? []
    const additionalOpenNotes = additionalOpenSemitones.map((s) => s + curr.openNote.number)
    return Math.min(prev, curr.openNote.number, ...additionalOpenNotes);
  }, 1000)
  const highestNote = instrument.strings.reduce(
    (prev, curr) => Math.max(prev, curr.openNote.number + instrument.stops),
    0
  )

  const validGroups = noteGroups.filter(
    notes => !notes.some((n) => n.note.number < lowestNote || n.note.number > highestNote)
  )

  const chords = validGroups.map(notes => {
    const abcnotes = notes
      .map(n => ({note:n.note, hst:n.harmonic?'!style=harmonic!':''}))
      .map((n) => `${n.hst}${n.note.abcnote()}`)
      .join('')
    return `[${abcnotes}]2`
  }).join(' ')

  const scoreText = `X:1/4\nK:C ${instrument.clef}\n${chords}`
  const visualOptions = {
    scale: props.scale,
    visualTranspose: instrument.transposition ?? 0
  }

  renderAbc(target, scoreText, visualOptions)
}

function show() {
  if (score.value === null) return
  if (props.noteGroups !== null) showScore(score.value, props.noteGroups, instrument.value)
  else showScore(score.value, [], instrument.value)
}


watch(() => props.noteGroups, show, { deep: true })
watch(() => props.instrument, show)
</script>

<template>
  <div ref="score"></div>
</template>
