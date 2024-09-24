/** Represents a single fingering, either stopping or touching the string with one finger. */
export interface Stop {
  /** The string index in the instrument (0 = first string, etc.) */
  stringIndex: number
  /** The MIDI note number (middle C = 60) */
  noteNumber: number
  /** The stepIndex (number of semitones over the open string) */
  stopIndex: number
  /** Is it touch fingering? */
  naturalHarmonic: boolean
}

/** Represent a string in a string instrument */
export interface InstrumentString {
    /** String name, typically the open string note name or a roman number */
    name: string
    /** Open string note as a MIDI number (middle C = 60) */
    openNote: number
}

export interface Instrument {
    /** Name of the instrument */
    name: string
    /** If it is a transposing instrument, number of semitones to add to get the written note. */
    transposition?: number
    /** Maximum number of semitones that can be stopped over the open string */
    stops: number
    /** Length of the vibrating part of the open string */
    scaleLength: number
    /** Length in mm of a hard stretch (distance between fingers) */
    hardStretch: number
    /** Maximum stretch length in mm */
    maxStretch: number
    clef: string
    strings: InstrumentString[]
}
