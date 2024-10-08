﻿import { describe, expect, it } from 'vitest'
import { abcnote, calculateFingerings, getStopRelPos, hasNoGaps, nn, noteName, noteNumber } from './fingerings.js'

describe('noteName', () => {
  it('return C4 for number 60', () => {
    expect(noteName(60)).toBe('C4')
  })
  it('return C#4 for number 61', () => {
    expect(noteName(61)).toBe('C#4')
  })
  it('return B4 for number 59', () => {
    expect(noteName(59)).toBe('B3')
  })
  it('throws for number 4.7', () => {
    expect(() => noteName(4.7)).toThrow()
  })
  it('throws for number -12', () => {
    expect(() => noteName(-12)).toThrow()
  })
})

describe('noteNumber', () => {
  it('returns 60 for middle C (C4)', () => {
    expect(noteNumber('C4')).toBe(60)
  })
  it('complies with octave changes between B and C', () => {
    expect(noteNumber('B3')).toBe(59)
  })
  it('recognizes lower case note names', () => {
    expect(noteNumber('d4')).toBe(62)
  })
  it('recognizes sharp alteration', () => {
    expect(noteNumber('C#4')).toBe(61)
  })
  it('recognizes flat alteration', () => {
    expect(noteNumber('Bb3')).toBe(58)
  })
  it('returns error message with empty string', () => {
    expect(noteNumber('')).to.be.a('string')
  })
  it('returns error message if no valid note is given', () => {
    expect(noteNumber('X5')).toBeTypeOf('string')
  })
  it('returns error message if no octave is given', () => {
    expect(noteNumber('G')).toBeTypeOf('string')
  })
  it('returns error message if an invalid alteration is given', () => {
    expect(noteNumber('Gy6')).toBeTypeOf('string')
  })
  it('returns error message if there are extra chars', () => {
    expect(noteNumber('Gb6!')).toBeTypeOf('string')
  })
  it('works with white spaces around', () => {
    expect(noteNumber('   gb6 ')).toBe(90)
  })
})

describe('nn', () => {
  it('returns the same as noteNumber', () => {
    expect(nn('D4')).toBe(62)
  })

  it('fails if no valid note is given', () => {
    expect(() => nn('X5')).toThrow()
  })
})

describe('getStopRelPos', () => {
  it('Returns expected results', () => {
    expect(getStopRelPos(0)).toBeCloseTo(0)
    expect(getStopRelPos(7)).toBeCloseTo(0.33258, 3)
    expect(getStopRelPos(12)).toBeCloseTo(0.5)
    expect(getStopRelPos(24)).toBeCloseTo(0.75)
  })
})

describe('abcnote', () => {
  it.each([
    ['C', 12 * 5],
    ['^C', (12 * 5) + 1],
    ['B,', 12 * 5 - 1],
    ['c', 12 * 6],
    ['c\'', 12 * 7],
    ['c\'\'', 12 * 8],
    ['C,', 12 * 4],
    ['C,,', 12 * 3]
  ])('returns %s for %i', (expected, midiNumber) => {
    expect(abcnote(midiNumber)).toBe(expected)
  })
})

const violin = {
  name: 'Violin',
  stops: 24,
  scaleLength: 330,
  image: 'violin_front.jpg',
  clef: 'treble',
  hardStretch: 78,
  maxStretch: 116,
  strings: [
    {
      name: 'G',
      openNote: nn('G3'),
    },
    {
      name: 'D',
      openNote: nn('D4'),
    },
    {
      name: 'A',
      openNote: nn('A4'),
    },
    {
      name: 'E',
      openNote: nn('E5'),
    }
  ]
}

describe('hasNoGaps', () => {
  it('Returns expected results', () => {
    expect(hasNoGaps(undefined, [
      { stringIndex: 3 },
      { stringIndex: 4 }])).toBe(true)
    expect(hasNoGaps(undefined, [
      { stringIndex: 1 },
      { stringIndex: 3 }])).toBe(false)
    expect(hasNoGaps(undefined, [
      { stringIndex: 1 },
      { stringIndex: 2 },
      { stringIndex: 4 }])).toBe(false)
  })
})

describe('calculateFingerings', () => {
  it('works with single note', () => {
    expect(calculateFingerings(violin, [72], [], false)).toStrictEqual([
      [
        {
          'naturalHarmonic': false,
          'noteNumber': 72,
          'stopIndex': 17,
          'stringIndex': 0
        }
      ],
      [
        {
          'naturalHarmonic': false,
          'noteNumber': 72,
          'stopIndex': 10,
          'stringIndex': 1
        }
      ],
      [
        {
          'naturalHarmonic': false,
          'noteNumber': 72,
          'stopIndex': 3,
          'stringIndex': 2
        }
      ]
    ])
  })
  it('works with quadruple stop C-major chord', () => {
    expect(calculateFingerings(violin, [60, 67, 72, 76], [], false)).toStrictEqual([
      [{
        'stringIndex': 0,
        'noteNumber': 60,
        'naturalHarmonic': false,
        'stopIndex': 5
      },
        {
          'stringIndex': 1,
          'noteNumber': 67,
          'naturalHarmonic': false,
          'stopIndex': 5
        },
        {
          'stringIndex': 2,
          'noteNumber': 72,
          'naturalHarmonic': false,
          'stopIndex': 3
        },
        {
          'stringIndex': 3,
          'noteNumber': 76,
          'naturalHarmonic': false,
          'stopIndex': 0
        }]
    ])
  })
})
