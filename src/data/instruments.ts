import { noteNumber } from '@/data/fingerings'

function nn(noteName: string) {
  const n = noteNumber(noteName)
  if (typeof n === 'string') throw `Invalid note name: ${n}`
  return n
}
export interface InstrumentString {
  name: string
  openNote: number
  startPositionInImage: number[]
  endPositionInImage: number[]
}

export interface Instrument {
  name: string
  transposition?: number
  stops: number
  scaleLength: number
  hardStretch: number
  maxStretch: number
  image: string
  clef: string
  strings: InstrumentString[]
}
