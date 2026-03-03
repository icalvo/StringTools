/** Represents a note with a specific enharmonic representation */
export interface Note {
    name: 'A'|'B'|'C'|'D'|'E'|'F'|'G'
    octave: number
    alteration: '#'|'b'|'x'|'bb'|''
    number: number
    text: () => string
    abcnote: () => string
}

/** Represents a pitch class (note name + alteration) without a specific octave */
export interface PitchClass {
    name: 'A'|'B'|'C'|'D'|'E'|'F'|'G'
    alteration: '#'|'b'|'x'|'bb'|''
    text: () => string
}

/** A note input that may or may not have a specific octave */
export type NoteInput = Note | PitchClass

/** Represents a single fingering, either stopping or touching the string with one finger. */
export interface StopCalculationData {
    /** The string index in the instrument (0 = first string, etc.) */
    stringIndex: number
    /** The stepIndex (number of semitones over the open string) */
    stopIndex: number
}

/** Represents a single fingering, either stopping or touching the string with one finger. */
export interface Stop extends StopCalculationData {
  /** The MIDI note number (middle C = 60) */
  noteNumber: number
  /** Is it touch fingering? */
  naturalHarmonic: boolean
}

/** Represent a string in a string instrument */
export interface InstrumentString {
    /** Open string note */
    openNote: Note
    /** Additional open strings, as semitone offsets from the open string */
    additionalOpenSemitones?: number[]
    /** Maximum number of semitones that can be stopped over the open string */
    stops?: number
}

/** Represent a string instrument */
export interface Instrument<TString extends InstrumentString> {
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
    /** Strings of the instrument  */
    strings: TString[]
}
