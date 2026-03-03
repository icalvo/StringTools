import { describe, expect, it } from 'vitest'
import {
    abcnote,
    calculateFingerings,
    expandPitchClass,
    fingeringHardness,
    generateNoteCombinations,
    getStopRelPos,
    hasNoGaps,
    hasPossibleStretch,
    isNote,
    nn,
    noteName,
    noteNumber,
    parse,
    tryParseInput
} from './fingerings.js'

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
  it('recognizes double flat alteration', () => {
    expect(noteNumber('Cbb4')).toBe(58)
  })
  it('recognizes double sharp alteration', () => {
    expect(noteNumber('Cx4')).toBe(62)
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
    ["c'", 12 * 7],
    ["c''", 12 * 8],
    ['C,', 12 * 4],
    ['C,,', 12 * 3]
  ])('returns %s for %i', (expected, midiNumber) => {
    expect(abcnote(midiNumber)).toBe(expected)
  })
})

describe('Note.abcnote', () => {
    it.each([
        ['C', parse('C4')],
        ['^C', parse('C#4')],
        ['_C', parse('Cb4')],
        ['B,', parse('B3')],
        ['c', parse('C5')],
        ["c'", parse('C6')],
        ["c''", parse('C7')],
        ['C,', parse('C3')],
        ['C,,', parse('C2')]
    ])('returns %s for %o', (expected, midiNumber) => {
        expect(midiNumber.abcnote()).toBe(expected)
    })
})
const violin = {
  name: 'Violin',
  stops: 24,
  scaleLength: 330,
  hardStretch: 78,
  maxStretch: 92,
  strings: [
    {
      openNote: parse('G3'),
    },
    {
      openNote: parse('D4'),
    },
    {
      openNote: parse('A4'),
    },
    {
      openNote: parse('E5'),
    }
  ]
}

const bassExtension = {
    name: 'Double bass with C-ext',
    stops: 24,
    scaleLength: 1049,
    hardStretch: 116,
    maxStretch: 120,
    strings: [
    {
      openNote: parse('E1'),
      additionalOpenSemitones: [-1,-2,-3,-4],
    },
    {
      openNote: parse('A1')
    },
    {
      openNote: parse('D2')
    },
    {
      openNote: parse('G2')
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
  it('works with bass with c-extension', () => {
    expect(calculateFingerings(bassExtension, [nn('D1'), nn('A1')], [], false)).toStrictEqual([
      [{
        'stringIndex': 0,
        'noteNumber': nn('D1'),
        'naturalHarmonic': false,
        'stopIndex': -2
      },
        {
          'stringIndex': 1,
          'noteNumber': nn('A1'),
          'naturalHarmonic': false,
          'stopIndex': 0
        }]
    ])
    expect(calculateFingerings(bassExtension, [nn('B0'), nn('A1')], [], false)).toStrictEqual([
      ])
  })
  it('discards reported impossible cases', () => {
    expect(calculateFingerings(
        violin,
        [nn('E4'), nn('G4'), nn('B4')],
        [hasPossibleStretch],
        false)).toStrictEqual([])
    expect(calculateFingerings(
        violin,
        [nn('E4'), nn('G4'), nn('A#4')],
        [hasPossibleStretch],
        false)).toStrictEqual([])
    expect(calculateFingerings(
        violin,
        [nn('F4'), nn('G#4'), nn('A#4')],
        [hasPossibleStretch],
        false)).toStrictEqual([])
  })
  it('accepts reported possible cases', () => {
    expect(calculateFingerings(
        violin, 
        [nn('A#4'), nn('B5')], 
        [hasPossibleStretch], 
        false)).toContainEqual(
        [{
          'stringIndex': 2,
          'noteNumber': nn('A#4'),
          'naturalHarmonic': false,
          'stopIndex': 1
        },
          {
            'stringIndex': 3,
            'noteNumber': nn('B5'),
            'naturalHarmonic': false,
            'stopIndex': 7
          }]
    )
  })
})

describe('fingeringHardness', () => {
  it('Returns expected results', () => {
    expect(fingeringHardness(violin, [
      { stringIndex: 0, stopIndex: 9 },
      { stringIndex: 1, stopIndex: 5 },
      { stringIndex: 2, stopIndex: 2 }])).toBe(1.0)
  })
})

describe('tryParseInput', () => {
  it('parses a note with octave as a Note', () => {
    const result = tryParseInput('C4')
    expect(typeof result).not.toBe('string')
    expect(isNote(result as any)).toBe(true)
    const note = result as ReturnType<typeof parse>
    expect(note.name).toBe('C')
    expect(note.octave).toBe(5)
    expect(note.number).toBe(60)
  })

  it('parses a single letter as a PitchClass', () => {
    const result = tryParseInput('G')
    expect(typeof result).not.toBe('string')
    expect(isNote(result as any)).toBe(false)
    expect((result as any).name).toBe('G')
    expect((result as any).alteration).toBe('')
    expect((result as any).text()).toBe('G')
  })

  it('parses a letter with sharp as a PitchClass', () => {
    const result = tryParseInput('C#')
    expect(typeof result).not.toBe('string')
    expect(isNote(result as any)).toBe(false)
    expect((result as any).name).toBe('C')
    expect((result as any).alteration).toBe('#')
    expect((result as any).text()).toBe('C#')
  })

  it('parses a letter with flat as a PitchClass', () => {
    const result = tryParseInput('Db')
    expect(typeof result).not.toBe('string')
    expect(isNote(result as any)).toBe(false)
    expect((result as any).name).toBe('D')
    expect((result as any).alteration).toBe('b')
  })

  it('parses double flat as a PitchClass', () => {
    const result = tryParseInput('Ebb')
    expect(typeof result).not.toBe('string')
    expect(isNote(result as any)).toBe(false)
    expect((result as any).alteration).toBe('bb')
  })

  it('parses double sharp as a PitchClass', () => {
    const result = tryParseInput('Fx')
    expect(typeof result).not.toBe('string')
    expect(isNote(result as any)).toBe(false)
    expect((result as any).alteration).toBe('x')
  })

  it('is case-insensitive', () => {
    const result = tryParseInput('c#')
    expect(typeof result).not.toBe('string')
    expect((result as any).name).toBe('C')
  })

  it('returns error for empty string', () => {
    expect(tryParseInput('')).toBeTypeOf('string')
  })

  it('returns error for invalid letter', () => {
    expect(tryParseInput('X')).toBeTypeOf('string')
  })

  it('returns error for invalid alteration', () => {
    expect(tryParseInput('Cy')).toBeTypeOf('string')
  })

  it('returns error for too-long input', () => {
    expect(tryParseInput('Cbb99')).toBeTypeOf('string')
  })
})

describe('expandPitchClass', () => {
  it('returns Notes within the MIDI range', () => {
    const pc = tryParseInput('C')
    expect(isNote(pc as any)).toBe(false)
    const notes = expandPitchClass(pc as any, 55, 100)
    expect(notes.length).toBeGreaterThan(0)
    for (const n of notes) {
      expect(n.name).toBe('C')
      expect(n.number).toBeGreaterThanOrEqual(55)
      expect(n.number).toBeLessThanOrEqual(100)
    }
  })

  it('returns C4, C5, C6, C7 for violin range', () => {
    const pc = tryParseInput('C')
    const notes = expandPitchClass(pc as any, 55, 100)
    expect(notes.map(n => n.text())).toEqual(['C4', 'C5', 'C6', 'C7'])
  })

  it('returns empty array when no octave fits', () => {
    const pc = tryParseInput('C')
    const notes = expandPitchClass(pc as any, 61, 71)
    expect(notes).toEqual([])
  })
})

describe('generateNoteCombinations', () => {
  it('returns a single combination when all inputs have octaves', () => {
    const inputs = [parse('G3'), parse('D4')]
    const combos = generateNoteCombinations(inputs, 0, 127)
    expect(combos).toHaveLength(1)
    expect(combos[0]!.map(n => n.text())).toEqual(['G3', 'D4'])
  })

  it('expands a PitchClass into multiple combinations', () => {
    const pc = tryParseInput('C')
    const note = parse('G5')
    const combos = generateNoteCombinations([pc as any, note], 55, 100)
    expect(combos.length).toBeGreaterThan(1)
    for (const combo of combos) {
      expect(combo).toHaveLength(2)
      expect(combo[0]!.name).toBe('C')
      expect(combo[1]!.text()).toBe('G5')
    }
  })

  it('produces cartesian product for two PitchClasses', () => {
    const c = tryParseInput('C')
    const g = tryParseInput('G')
    const combos = generateNoteCombinations([c as any, g as any], 55, 100)
    const cCount = expandPitchClass(c as any, 55, 100).length
    const gCount = expandPitchClass(g as any, 55, 100).length
    expect(combos).toHaveLength(cCount * gCount)
  })

  it('returns empty when a PitchClass has no valid octaves', () => {
    const pc = tryParseInput('C')
    const combos = generateNoteCombinations([pc as any], 61, 71)
    expect(combos).toHaveLength(0)
  })
})