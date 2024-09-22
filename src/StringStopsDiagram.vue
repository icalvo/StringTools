<script setup lang="ts">
import {computed} from 'vue'
import {type InstrumentString} from '@/data/instruments'
import {getStopRelPos} from '@/data/fingerings'
import {fingeringColor} from '@/data/presentation'
import {useFingeringStore} from "@/stores/fingeringsStore";
import {useInstrumentsStore} from "@/stores/instrumentsStore";
const props = defineProps<{
  instrumentIndex: number
}>()

const fingeringsStore = useFingeringStore()
const instrumentsStore = useInstrumentsStore()
const instruments = instrumentsStore.instruments
const instrument = computed(() => instruments[props.instrumentIndex])
const stops = computed(() =>
    fingeringsStore.fingeringToggles.flatMap((fingeringToggle, fingeringIndex) => {
      if (!fingeringToggle.enabled) return []
      const fingering = fingeringToggle.fingering
      const hardFingering = fingering.some((stop) => ('hard' in stop ? stop.hard : false))
      return fingering.map((s) => {
        const stopPos = getStopRelPos(s.stopIndex)
        const stopAbsPos = getStopAbsPos(instrument.value.strings[s.stringIndex], stopPos)
        return {
          x: stopAbsPos.x,
          y: stopAbsPos.y,
          r: hardFingering ? 4 : 8,
          color: fingeringColor(fingeringsStore.fingeringToggles.length, fingeringIndex),
          isOpen: s.stopIndex === 0,
          isStopped: s.stopIndex !== 0 && !s.naturalHarmonic,
          isNaturalHarmonic: s.naturalHarmonic
        }
      })
    })
)
const strings = computed(() =>
    instrument.value.strings.map((string) => ({
      sx: string.startPositionInImage[0],
      sy: string.startPositionInImage[1],
      ex: string.endPositionInImage[0],
      ey: string.endPositionInImage[1]
    }))
)

const allStops = computed(() =>
    strings.value.flatMap((string) =>
        [...Array(instrument.value.stops + 1).keys()].map((stopIndex) => {
          const stopRelPos = getStopRelPos(stopIndex)
          const stopX = string.sx + (string.ex - string.sx) * stopRelPos
          const stopY = string.sy + (string.ey - string.sy) * stopRelPos
          return {x: stopX, y: stopY}
        })
    )
)

function getStopAbsPos(string: InstrumentString, stopRelPos: number) {
  const stringStartX = string.startPositionInImage[0]
  const stringStartY = string.startPositionInImage[1]
  const stringEndX = string.endPositionInImage[0]
  const stringEndY = string.endPositionInImage[1]
  const stopX = stringStartX + (stringEndX - stringStartX) * stopRelPos
  const stopY = stringStartY + (stringEndY - stringStartY) * stopRelPos
  return {x: stopX, y: stopY}
}
</script>

<template>
  <svg viewBox="0 0 600 1018" :style="{ backgroundImage: `url(${instrument.image})` }">
    <line
        v-for="(c, idx) in strings"
        :key="idx"
        :x1="c.sx"
        :y1="c.sy"
        :x2="c.ex"
        :y2="c.ey"
        stroke="blue"
    />
    <circle
        v-for="(c, idx) in allStops"
        :key="idx"
        :cx="c.x"
        :cy="c.y"
        :r="3"
        stroke="black"
        stroke-width="2"
        fill="white"
    />
    <circle
        v-for="(c, idx) in stops.filter((x) => x.isStopped)"
        :key="idx"
        :cx="c.x"
        :cy="c.y"
        :r="c.r"
        stroke="black"
        stroke-width="2"
        :fill="c.color"
    />
    <polygon
        v-for="(c, idx) in stops.filter((x) => x.isNaturalHarmonic)"
        :key="idx"
        :points="`${c.x-c.r},${c.y} ${c.x},${c.y-c.r} ${c.x+c.r},${c.y} ${c.x},${c.y+c.r}`"
        stroke="black"
        stroke-width="2"
        :fill="c.color"
    />

    <circle
        v-for="(c, idx) in stops.filter((x) => x.isOpen)"
        :key="idx"
        :cx="c.x"
        :cy="c.y"
        :r="c.r"
        :stroke="c.color"
        stroke-width="2"
        fill="none"
    />
  </svg>
</template>

<style scoped>
svg {
  background-clip: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-position-y: center;
}
</style>
