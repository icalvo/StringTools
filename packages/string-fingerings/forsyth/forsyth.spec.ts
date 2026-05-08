import { describe, expect, it } from 'vitest'
import { calculateFingerings, parse } from '../fingerings.js'
import {
  forsythCompatible,
  getForsythInstrumentFamily,
  hasEncodedForsythRules,
  hasForsythValidation,
  violinDoubleStopForsythCompatible
} from './forsyth.js'

const violin = {
  name: 'Violin',
  stops: 24,
  scaleLength: 330,
  hardStretch: 78,
  maxStretch: 92,
  strings: [
    { openNote: parse('G3') },
    { openNote: parse('D4') },
    { openNote: parse('A4') },
    { openNote: parse('E5') }
  ]
}

const viola = {
  name: 'Viola (16")',
  stops: 18,
  scaleLength: 406,
  hardStretch: 78,
  maxStretch: 92,
  strings: [
    { openNote: parse('C3') },
    { openNote: parse('G3') },
    { openNote: parse('D4') },
    { openNote: parse('A4') }
  ]
}

describe('getForsythInstrumentFamily', () => {
  it('maps known instrument names', () => {
    expect(getForsythInstrumentFamily('Violin')).toBe('violin')
    expect(getForsythInstrumentFamily('Viola (16.5")')).toBe('viola')
    expect(getForsythInstrumentFamily('Cello')).toBe('cello')
    expect(getForsythInstrumentFamily('Double bass (4 str. 3/4)')).toBe('doubleBass')
    expect(getForsythInstrumentFamily('Unknown')).toBe(null)
  })
})

describe('hasEncodedForsythRules', () => {
  it('is true only for violin in M1', () => {
    expect(hasEncodedForsythRules('violin')).toBe(true)
    expect(hasEncodedForsythRules('viola')).toBe(false)
    expect(hasEncodedForsythRules('cello')).toBe(false)
    expect(hasEncodedForsythRules('doubleBass')).toBe(false)
    expect(hasEncodedForsythRules(null)).toBe(false)
  })
})

describe('hasForsythValidation', () => {
  it('matches encoded rules for store instrument names', () => {
    expect(hasForsythValidation(violin)).toBe(true)
    expect(hasForsythValidation(viola)).toBe(false)
  })
})

describe('violinDoubleStopForsythCompatible', () => {
  it('rejects non-adjacent strings', () => {
    expect(
      violinDoubleStopForsythCompatible([
        { stringIndex: 0, stopIndex: 0, noteNumber: 55, naturalHarmonic: false },
        { stringIndex: 2, stopIndex: 0, noteNumber: 69, naturalHarmonic: false }
      ])
    ).toBe(false)
  })

  it('rejects tritone class between pitches', () => {
    expect(
      violinDoubleStopForsythCompatible([
        { stringIndex: 0, stopIndex: 17, noteNumber: 72, naturalHarmonic: false },
        { stringIndex: 1, stopIndex: 4, noteNumber: 66, naturalHarmonic: false }
      ])
    ).toBe(false)
  })

  it('rejects minor second with both strings stopped', () => {
    expect(
      violinDoubleStopForsythCompatible([
        { stringIndex: 1, stopIndex: 9, noteNumber: 71, naturalHarmonic: false },
        { stringIndex: 2, stopIndex: 2, noteNumber: 72, naturalHarmonic: false }
      ])
    ).toBe(false)
  })

  it('allows minor second when an open string is used', () => {
    expect(
      violinDoubleStopForsythCompatible([
        { stringIndex: 2, stopIndex: 8, noteNumber: 77, naturalHarmonic: false },
        { stringIndex: 3, stopIndex: 0, noteNumber: 76, naturalHarmonic: false }
      ])
    ).toBe(true)
  })

  it('allows major third on adjacent strings', () => {
    expect(
      violinDoubleStopForsythCompatible([
        { stringIndex: 0, stopIndex: 2, noteNumber: 57, naturalHarmonic: false },
        { stringIndex: 1, stopIndex: 1, noteNumber: 61, naturalHarmonic: false }
      ])
    ).toBe(true)
  })
})

describe('forsythCompatible', () => {
  it('passes natural harmonics through without interval check', () => {
    expect(
      forsythCompatible(violin, [
        { stringIndex: 0, stopIndex: 12, noteNumber: 67, naturalHarmonic: true },
        { stringIndex: 1, stopIndex: 5, noteNumber: 60, naturalHarmonic: false }
      ])
    ).toBe(true)
  })

  it('returns true for viola (no encoded rules; defensive)', () => {
    expect(
      forsythCompatible(viola, [
        { stringIndex: 0, stopIndex: 5, noteNumber: 55, naturalHarmonic: false },
        { stringIndex: 1, stopIndex: 5, noteNumber: 61, naturalHarmonic: false }
      ])
    ).toBe(true)
  })

  it('filters tritone double stops with calculateFingerings', () => {
    const withForsyth = calculateFingerings(violin, [72, 66], [forsythCompatible], false)
    const without = calculateFingerings(violin, [72, 66], [], false)
    expect(without.length).toBeGreaterThan(0)
    expect(withForsyth.length).toBeLessThan(without.length)
    expect(withForsyth.every((f) => forsythCompatible(violin, f))).toBe(true)
  })

  it('keeps open-string minor-second fingering when Forsyth is on', () => {
    const withForsyth = calculateFingerings(violin, [76, 77], [forsythCompatible], false)
    expect(withForsyth.length).toBeGreaterThan(0)
  })
})
