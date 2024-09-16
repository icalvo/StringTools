import type { Instrument } from '@/data/instruments'

export interface Stop {
  stringIndex: number
  noteNumber: number
  stopIndex: number
  naturalHarmonic: boolean
}

export function noteNumber(noteName: string): number | string {
  if (noteName == null) return 'Null note name'
  noteName = noteName.trim().toUpperCase()
  if (noteName.length < 2) return 'Note names must be at least two characters long'
  let pointer = 0
  const firstChar = noteName.charCodeAt(pointer)
  if (firstChar < 65 || firstChar > 65 + 7) return 'First char must be ABCDEFG'

  const noteIndex = (firstChar - 67 + 7) % 7
  const semitoneIndex = [0, 2, 4, 5, 7, 9, 11]

  pointer++
  let alteration = 0
  if (noteName.charAt(1) === '#') {
    alteration = 1
    pointer++
  } else if (noteName.charAt(1) === 'b') {
    alteration = -1
    pointer++
  }
  const octave = parseInt(noteName.charAt(pointer))
  if (isNaN(octave)) return 'Last char must be a number'
  pointer++
  if (pointer !== noteName.length) return 'Note name has extra characters'

  return semitoneIndex[noteIndex] + alteration + octave * 12
}

export function noteName(noteNumber: number): string {
  const noteIndex = noteNumber % 12
  const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex]
  const octave = Math.floor(noteNumber / 12)
  return noteName + octave
}

function* stopsForString(
  instrument: Instrument,
  stringIndex: number,
  noteNumber: number,
  includeNaturalHarmonics: boolean
) {
  console.debug(`Calculating stop for note ${noteNumber} on string ${stringIndex}`)
  const instrumentString = instrument.strings[stringIndex]
  const openNote = instrumentString.openNote as number
  const stopIndex = noteNumber - openNote

  if (stopIndex < 0) {
    console.debug(`${noteName(noteNumber)} is too low for ${instrumentString.name} string`)
    return
  }

  if (stopIndex > instrument.stops) {
    console.debug(`${noteName(noteNumber)} is too high for ${instrumentString.name} string`)
    return
  }

  yield { stringIndex, noteNumber, stopIndex, naturalHarmonic: false }

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

export function getStopRelPos(stopIndex: number): number {
  return 1 - Math.pow(2, -stopIndex / 12)
}

function stopsForInstrument(
  instrument: Instrument,
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

function fingeringStretch(instrument: Instrument, stop1: Stop, stop2: Stop): number {
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

function fingeringStretches(instrument: Instrument, stops: Stop[]): [Stop, number, Stop][] {
  return stops
    .pairwise()
    .map(([stop1, stop2]) => [stop1, fingeringStretch(instrument, stop1, stop2), stop2])
}

// let isOpenString stop = stop = 0
function isOpenString(stop: Stop): boolean {
  return stop.stopIndex === 0
}

function stretchHardness(
  instrument: Instrument,
  stop1: Stop,
  stretch: number,
  stop2: Stop
): number {
  if (isOpenString(stop1) || isOpenString(stop2)) {
    return 0.0
  }

  if (stretch > instrument.maxStretch) {
    return 1.0
  }

  if (stretch > instrument.hardStretch) {
    return 0.5
  }

  return 0.1
}

function stretchesHardness(instrument: Instrument, stretches: [Stop, number, Stop][]): number {
  return stretches
    .map(([stop1, stretch, stop2]) => stretchHardness(instrument, stop1, stretch, stop2))
    .reduce((a, b) => Math.max(a, b))
}

// let fingeringHardness instrument fingering =
//     fingering
//     |> List.sortBy (fun (str, _, _) -> str)
//     |> fingeringStretches instrument
//     |> stretchesHardness instrument
function fingeringHardness(instrument: Instrument, fingering: Stop[]): number {
  const sortedFingering = fingering.sort((s1, s2) => s1.stringIndex - s2.stringIndex)

  return stretchesHardness(instrument, fingeringStretches(instrument, sortedFingering))
}

export function hasNoGaps(_instrument: Instrument, fingering: Stop[]): boolean {
  return fingering
    .map((stop) => stop.stringIndex)
    .sort()
    .pairwise()
    .every(([str1, str2]) => Math.abs(str1 - str2) <= 1)
}

export function hasPossibleStretch(instrument: Instrument, fingering: Stop[]): boolean {
  return fingeringHardness(instrument, fingering) !== 1.0
}

export function calculateFingerings(
  instrument: Instrument,
  notes: number[],
  validations: Function[],
  includeNaturalHarmonics: boolean = false
): Stop[][] {
  console.debug(`Calculating fingerings for ${notes} on ${instrument.name}`)

  const stopsByNote = stopsForInstrument(instrument, notes, includeNaturalHarmonics)
  console.debug('Stops:', stopsByNote)

  if (notes.length === 1) {
    if (stopsByNote.length === 0) return []
    return stopsByNote[0].map((f) => [f])
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
