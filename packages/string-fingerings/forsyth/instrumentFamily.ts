/** Maps app instrument names to Forsyth rule families. */
export type ForsythFamily = 'violin' | 'viola' | 'cello' | 'doubleBass'

export function getForsythInstrumentFamily(instrumentName: string): ForsythFamily | null {
  if (instrumentName === 'Violin') return 'violin'
  if (instrumentName.startsWith('Viola')) return 'viola'
  if (instrumentName === 'Cello') return 'cello'
  if (instrumentName.startsWith('Double bass')) return 'doubleBass'
  return null
}

/** Families that currently have any encoded Forsyth validation (M1: violin double stops only). */
export function hasEncodedForsythRules(family: ForsythFamily | null): boolean {
  return family === 'violin'
}
