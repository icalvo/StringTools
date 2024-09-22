export interface Stop {
  stringIndex: number
  noteNumber: number
  stopIndex: number
  naturalHarmonic: boolean
}

export type FingeringToggle = { enabled: boolean, fingering: Stop[] }

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
