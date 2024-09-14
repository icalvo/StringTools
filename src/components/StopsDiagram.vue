<script setup lang="ts">
import {useTemplateRef, onMounted, watch} from 'vue'
import {type Instrument, instruments, type InstrumentString} from '@/data/instruments'
import type {Stop} from "@/data/types";
import {getStopRelPos} from "@/data/fingerings";

const props = withDefaults(
  defineProps<{
    fingerings: Array<Array<Stop>> | null,
    instrumentIndex: number
  }>(),
  {
    
  }
)

const canvas = useTemplateRef<HTMLCanvasElement>('my-canvas')
let ctx: CanvasRenderingContext2D

async function loadImage(src: string) {
  const img = new Image()
  const promise = new Promise<void>(function (resolve) {
    img.addEventListener('load', () => {
      ctx.drawImage(img, 0, 0)
      resolve()
    })
  })
  img.src = src
  return promise
}

function circleSector(x: number, y: number, r: number, a1: number, a2: number, hue: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, a1, a2)
  ctx.lineTo(x, y)
  ctx.fillStyle = `hsl(${hue} 100% 50%)`
  ctx.fill()
}

function circle(x: number, y: number, r: number, hue: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = `hsl(${hue} 100% 50%)`
  ctx.fill()
  ctx.strokeStyle = 'black'
  ctx.stroke()
}

function circumference(x: number, y: number, r: number, hue: number) {
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.strokeStyle = `hsl(${hue} 100% 50%)`
  ctx.stroke()
}

function drawStrings(instrument: Instrument) {
  for (const string of instrument.strings) {
    ctx.beginPath()
    ctx.moveTo(string.startPositionInImage[0], string.startPositionInImage[1])
    ctx.lineTo(string.endPositionInImage[0], string.endPositionInImage[1])
    ctx.strokeStyle = 'rgb(0 100 200)'
    ctx.stroke()
    for (let stopIndex = 0; stopIndex <= instrument.stops; stopIndex++) {
      const stopRelPos = getStopRelPos(stopIndex);
      const stopAbsPos = getStopAbsPos(string, stopRelPos);
      const x = stopAbsPos[0];
      const y = stopAbsPos[1];
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.strokeStyle = 'black'
      ctx.stroke()
    }
  }
}

function getStopAbsPos(string: InstrumentString, stopRelPos: number): number[] {
  const stringStartX = string.startPositionInImage[0];
  const stringStartY = string.startPositionInImage[1];
  const stringEndX = string.endPositionInImage[0];
  const stringEndY = string.endPositionInImage[1];
  const stopX = stringStartX + (stringEndX - stringStartX) * stopRelPos;
  const stopY = stringStartY + (stringEndY - stringStartY) * stopRelPos;
  return [stopX, stopY]
}

function drawStop(
  instrument: Instrument,
  stringIndex: number,
  stopPos: number,
  fingeringIndex: number,
  hard: boolean
) {
  const stopAbsPos = getStopAbsPos(instrument.strings[stringIndex], stopPos);
  const stopX = stopAbsPos[0];
  const stopY = stopAbsPos[1];
  const hue = fingeringIndex * 40;
  console.debug(
    `Fingering ${fingeringIndex + 1} at (${stopX}, ${stopY}), hue ${hue}, stopPos ${stopPos}`
  )
  const r = hard ? 4 : 8;
  if (stopPos === 0) {
    circumference(stopX, stopY, r, hue)
  } else {
    circle(stopX, stopY, r, hue)
  }
}

function groupBy<T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) {
  return array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });
}

function drawFingerings(instrument: Instrument, fingerings: Stop[][]) {
  const x = fingerings.flatMap((fingering, fingeringIndex) => {
    const hardFingering = fingering.some(stop => 'hard' in stop ? stop.hard : false);
    return fingering.map(s => {
      const r:[Stop, number, boolean] = [s, fingeringIndex, hardFingering];
      return r;
    });
  });
  const y = groupBy(x, ([s, _, __]) => `${s.stopIndex} ${s.stringIndex}`);

  for (let fingeringIndex = 0; fingeringIndex < fingerings.length; fingeringIndex++) {
    const fingering = fingerings[fingeringIndex]
    const hardFingering = fingering.some(stop => 'hard' in stop ? stop.hard : false);
    fingering.forEach(stop => {
      drawStop(instrument, stop.stringIndex, getStopRelPos(stop.stopIndex), fingeringIndex, hardFingering);
    });
  }
}

async function drawInstrument(instrument: Instrument) {
  await loadImage(instrument.image);
  drawStrings(instrument);
}
async function drawAll() {
  ctx = canvas.value?.getContext('2d')!
  const instrument = instruments[props.instrumentIndex]
  const fingerings = props.fingerings

  await drawInstrument(instrument);

  if (fingerings !== null)
    drawFingerings(instrument, fingerings)
}
watch(() => props.fingerings, () => {
  drawAll()
});

watch(() => props.instrumentIndex, () => {
  drawAll()
});

</script>

<template>
  <canvas ref="my-canvas" width="600" height="1018"></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid red;
}
</style>
