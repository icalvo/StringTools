export interface Stop {
  stringIndex: number
  noteNumber: number
  stopIndex: number
  naturalHarmonic: boolean
}

export type FingeringToggle = { enabled: boolean, fingering: Stop[] }
