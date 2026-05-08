import type { Instrument, InstrumentString, Stop } from '../types.js'
import { getForsythInstrumentFamily, hasEncodedForsythRules } from './instrumentFamily.js'
import { violinDoubleStopForsythCompatible } from './violinDoubleStops.js'

export { getForsythInstrumentFamily, hasEncodedForsythRules } from './instrumentFamily.js'
export { violinDoubleStopForsythCompatible } from './violinDoubleStops.js'

export function hasForsythValidation<TString extends InstrumentString>(instrument: Instrument<TString>): boolean {
  return hasEncodedForsythRules(getForsythInstrumentFamily(instrument.name))
}

/**
 * When enabled from the UI, filters fingerings using encoded Forsyth guidance.
 * Unsupported families or stop counts return true so callers should gate on {@link hasForsythValidation}.
 */
export function forsythCompatible<TString extends InstrumentString>(
  instrument: Instrument<TString>,
  fingering: Stop[]
): boolean {
  const family = getForsythInstrumentFamily(instrument.name)
  if (!hasEncodedForsythRules(family)) return true

  if (fingering.some((s) => s.naturalHarmonic)) return true

  const n = fingering.length
  if (n <= 1) return true
  if (family === 'violin' && n === 2) return violinDoubleStopForsythCompatible(fingering)
  return true
}
