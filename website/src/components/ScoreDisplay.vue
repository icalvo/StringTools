<script setup lang="ts">
import {abcnote, type Instrument} from 'string-fingerings'
import { renderAbc } from 'abcjs'
import {computed, useTemplateRef, watch} from 'vue'
import { useInstrumentsStore } from "@/stores/instrumentsStore";

const instrumentsStore = useInstrumentsStore()
const instruments = instrumentsStore.instruments


const props = withDefaults(
    defineProps<{
      notes: {note:number,harmonic:boolean}[] | null
      instrument: number | Instrument
      scale?: number
    }>(),
    { scale: 2 })

const instrument = computed(() => 
    typeof props.instrument === "number"
    ? instruments[props.instrument]
    : props.instrument)
function showScore(target: HTMLElement, notes: {note:number,harmonic:boolean}[], instrument: Instrument) {
  const lowestNote = instrument.strings.reduce((prev, curr) => Math.min(prev, curr.openNote), 1000)
  const highestNote = instrument.strings.reduce(
    (prev, curr) => Math.max(prev, curr.openNote + instrument.stops),
    0
  )
  if (notes.some((n) => n.note < lowestNote || n.note > highestNote)) {
    notes = []
  }

  const abcnotes = notes.map(n => ({note:n.note, hst:n.harmonic?'!style=harmonic!':''})).map((n) => `${n.hst}${abcnote(n.note)}`).join('')
  const score = `X:1/4\nK:C ${instrument.clef}\n[${abcnotes}]2`
  const visualOptions = {
    scale: props.scale,
    visualTranspose: instrument.transposition ?? 0
  }

  renderAbc(target, score, visualOptions)
}

function show() {
  if (score.value === null) return
  if (props.notes !== null) showScore(score.value, props.notes, instrument.value)
  else showScore(score.value, [], instrument.value)
}

const score = useTemplateRef('score')

watch(() => props.notes, show)
watch(() => props.instrument, show)
</script>

<template>
  <div ref="score"></div>
</template>
