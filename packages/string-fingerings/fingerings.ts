import type {Instrument, InstrumentString, Note, Stop, StopCalculationData} from './types.js'
class NoteImpl implements Note {
    constructor(
        public name: Note['name'],
        public octave: Note['octave'],
        public alteration: Note['alteration'],
        public number: Note['number']
    ) {}
    text() {
        return this.name + this.alteration + (this.octave -1)
    }

    abcnote(): string {
        let noteName = this.name.toLowerCase()
        let alteration = ''
        switch (this.alteration) {
            case '#': alteration = '^'; break
            case 'b': alteration = '_'; break
            case 'x': alteration = '^^'; break
            case 'bb': alteration = '__'; break
            case '': alteration = ''; break
        }
        const octave = this.octave
        let ticks: number
        if (octave <= 5) {
            noteName = noteName.toUpperCase()
            ticks = 5 - octave
            return `${alteration}${noteName}${','.repeat(ticks)}`
        } else {
            ticks = octave - 6
            return `${alteration}${noteName}${"'".repeat(ticks)}`
        }
    }
}
export function tryParse(noteText: string): Note | string {
    noteText = noteText.trim()
    if (noteText.length < 2) return 'Note names must be at least two characters long'
    if (noteText.length > 4) return 'Note names must be at most four characters long'
    const firstChar = noteText.charAt(0).toUpperCase()
    const lastChar = noteText.charAt(noteText.length - 1)
    if (firstChar < 'A' || firstChar > 'G') return 'First char must be A-G'
    if (lastChar < '0' || lastChar > '9') return 'Last char must be a number'
    const octave = parseInt(lastChar)
    if (isNaN(octave)) return 'Last char must be a number'
    const alteration = noteText.substring(1, noteText.length - 1)
    let alterationOffset = 0
    switch (alteration) {
        case 'bb': alterationOffset = -2; break
        case 'x': alterationOffset = 1; break
        case 'b': alterationOffset = -1; break
        case '#': alterationOffset = 1; break
        case '': alterationOffset = 0; break
        default: return 'Second char must be #, b, x or bb. Text: ' + noteText + ', alteration: ' + alteration
    }
    const noteIndex = (firstChar.charCodeAt(0) - 67 + 7) % 7
    const semitoneIndex = [0, 2, 4, 5, 7, 9, 11]
    const number = 
        (semitoneIndex[noteIndex] ?? NaN) + alterationOffset + (octave + 1) * 12
    return new NoteImpl(
        firstChar as Note['name'],
        octave + 1,
        alteration as Note['alteration'],
        number
    )
}
export function parse(noteText: string): Note {
    const result = tryParse(noteText)
    if (typeof result === 'string') throw result
    return result
}
/**
 * Gets the MIDI note number from a text representation (middle C is 'C4')
 * @param noteName Can include sharp (#) and flat (b) alterations, like Db5 or F#2.
 * @returns The MIDI note number or a string with an explanatory error message.
 */
export function noteNumber(noteName: string): number | string {
    const n = tryParse(noteName)
    if (typeof n === 'string') return n
    return n.number
}

export function nn(noteName: string) {
    const n = noteNumber(noteName)
    if (typeof n === 'string') throw `Invalid note name: ${n}`
    return n
}

export function noteName(noteNumber: number): string {
  if (!Number.isSafeInteger(noteNumber) || noteNumber < 0 || noteNumber > 127) {
    throw "Invalid note number"
  }

  const noteIndex = noteNumber % 12
  const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex] ?? ""
  const octave = Math.floor((noteNumber / 12)) - 1
  return noteName + octave
}

export function abcnote(noteNumber: number): string {
    return parse(noteName(noteNumber)).abcnote()
}

function* stopsForString<TString extends InstrumentString>(
  instrument: Instrument<TString>,
  stringIndex: number,
  noteNumber: number,
  includeNaturalHarmonics: boolean
) {
  console.debug(`Calculating stop for note ${noteNumber} on string ${stringIndex}`)
  const instrumentString = instrument.strings[stringIndex]
  if (!instrumentString) return;
  const openNote = instrumentString.openNote as number
  const stopIndex = noteNumber - openNote
  const additionalOpenNotes = instrumentString.additionalOpenNotes ?? []

  if (stopIndex < 0 && !additionalOpenNotes.includes(noteNumber)) {
    console.debug(`${noteName(noteNumber)} is too low for ${instrumentString.name} string`)
    return
  }

  if (stopIndex > (instrumentString.stops ?? instrument.stops)) {
    console.debug(`${noteName(noteNumber)} is too high to stop for ${instrumentString.name} string`)
  }
  else {
    yield { stringIndex, noteNumber, stopIndex, naturalHarmonic: false }
  }

  if (includeNaturalHarmonics) {
    const naturalHarmonics = [
      { partial: 2, touch: 12, produces: 12 },
      { partial: 3, touch: 7, produces: 12 + 7 },
      { partial: 3, touch: 12 + 7, produces: 12 + 7 },
      { partial: 4, touch: 5, produces: 12 + 7 + 5 },
      { partial: 4, touch: 12 + 7 + 5, produces: 12 + 7 + 5 },
      { partial: 5, touch: 4, produces: 12 + 7 + 5 + 4 },
      { partial: 5, touch: 12 + 4, produces: 12 + 7 + 5 + 4 },
      { partial: 5, touch: 12 + 7 + 5 + 4, produces: 12 + 7 + 5 + 4 }
    ]

    yield* naturalHarmonics
      .map((h) => ({
        stringIndex,
        stopIndex: h.touch,
        noteNumber: h.produces + openNote,
        naturalHarmonic: true
      }))
      .filter((h) => h.noteNumber === noteNumber)
  }
}

/**
 * Returns the stop position relative to a string of length 1
 * @param stopIndex semitone index (number of semitones above the open string)
 */
export function getStopRelPos(stopIndex: number): number {
  return 1 - Math.pow(2, -stopIndex / 12)
}

function stopsForInstrument<TString extends InstrumentString>(
  instrument: Instrument<TString>,
  notes: number[],
  includeNaturalHarmonics: boolean
): Stop[][] {
  const result: Stop[][] = notes.map((note) =>
    instrument.strings
      .flatMap((_s, stringIndex) => [
        ...stopsForString(instrument, stringIndex, note, includeNaturalHarmonics)
      ])
      .filter((f) => f !== null)
  )

  if (result.some((r) => r.length === 0)) {
    return []
  }

  return result
}

function cross(addValidation: Function, l1: Stop[][], l2: Stop[]): Stop[][] {
  if (l1.length === 0) {
    return l2.map((l) => [l])
  }

  return l1.flatMap((i1) => l2.filter((i2) => addValidation(i1, i2)).map((i2) => i1.concat([i2])))
}

function fingeringStretch<TString extends InstrumentString>(instrument: Instrument<TString>, stop1: StopCalculationData, stop2: StopCalculationData): number {
  const stopRelPos1 = getStopRelPos(stop1.stopIndex)
  const stopRelPos2 = getStopRelPos(stop2.stopIndex)
  return instrument.scaleLength * Math.abs(stopRelPos2 - stopRelPos1)
}

declare global {
  interface Array<T> {
    pairwise(): Array<[T, T]>
  }
}

Array.prototype.pairwise = function () {
  return this.slice(1).map((x, i) => [this[i], x])
}

function isOpenString(stop: StopCalculationData): boolean {
  return stop.stopIndex <= 0
}

function stretchHardness<TString extends InstrumentString>(
    instrument: Instrument<TString>,
    stop1: StopCalculationData,
    stop2: StopCalculationData,
    multiplier: number
): number {
  const stretch = fingeringStretch(instrument, stop1, stop2)
  console.debug(`Stretch: ${stretch}`, stop1, stop2)
  if (isOpenString(stop1) || isOpenString(stop2)) {
    return 0.0
  }

  if (stretch > instrument.maxStretch * multiplier) {
    return 1.0
  }

  if (stretch > instrument.hardStretch * multiplier) {
    return 0.5
  }

  return 0.1
}

export function fingeringHardness<TString extends InstrumentString>(instrument: Instrument<TString>, fingering: StopCalculationData[]): number {
  const sortedFingering = fingering.sort((s1, s2) => s1.stringIndex - s2.stringIndex)
  const stopPairs = sortedFingering.pairwise()
  const sortedByStopIndex = sortedFingering.sort((s1, s2) => s1.stopIndex - s2.stopIndex)
  const minStop = sortedByStopIndex[0]
  if (!minStop) throw "minStop is undefined"
  const maxStop = sortedByStopIndex[sortedByStopIndex.length - 1]
  if (!maxStop) throw "maxStop is undefined"
  const contiguousStretchHardnesses =
      stopPairs
          .map(([stop1, stop2]) => stretchHardness(instrument, stop1, stop2, 1))
  const totalStretchHardness = stretchHardness(instrument, minStop, maxStop, 1.02)
  const allStretchHardnesses = contiguousStretchHardnesses.concat(totalStretchHardness)
  return Math.max(...allStretchHardnesses)
}

export function hasNoGaps(_instrument: any, fingering: {stringIndex: number}[]): boolean {
  return fingering
    .map((stop) => stop.stringIndex)
    .sort()
    .pairwise()
    .every(([str1, str2]) => Math.abs(str1 - str2) <= 1)
}

export function hasPossibleStretch<TString extends InstrumentString>(instrument: Instrument<TString>, fingering: Stop[]): boolean {
  return fingeringHardness(instrument, fingering) !== 1.0
}

/**
 * Calculates the fingerings for an instrument and a set of notes.
 * @param instrument
 * @param notes
 * @param validations
 * @param includeNaturalHarmonics
 */
export function calculateFingerings<TString extends InstrumentString>(
  instrument: Instrument<TString>,
  notes: number[],
  validations: Function[],
  includeNaturalHarmonics: boolean = false
): Stop[][] {
  console.debug(`Calculating fingerings for ${notes} on ${instrument.name}`)

  const stopsByNote = stopsForInstrument(instrument, notes, includeNaturalHarmonics)

  if (notes.length === 1) {
    return stopsByNote.flatMap(noteStops => noteStops.map(s => [s]))
  }

  const init: Stop[][] = []
  return stopsByNote
    .reduce((acc, stops) => cross(stringIsNotRepeated, acc, stops), init)
    .filter(validation)

  function stringIsNotRepeated(stopList: Stop[], stop: Stop): boolean {
    return stopList.every((existingStop) => existingStop.stringIndex !== stop.stringIndex)
  }

  function validation(fng: Stop[]): boolean {
    return validations.map((val) => val(instrument, fng)).every((result) => result)
  }
}
