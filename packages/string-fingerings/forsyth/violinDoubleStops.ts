import type { Stop } from '../types.js'

/**
 * Violin double stops — conservative rules aligned with Cecil Forsyth, *Orchestration*
 * (Macmillan; 1st ed. 1914 — see IMSLP https://imslp.org/wiki/Orchestration_(Forsyth,_Cecil) ),
 * violin chapter: practical double stops are built from thirds, fourths, fifths, sixths,
 * and sevenths; seconds are chiefly reliable with an open string; the tritone span is
 * avoided in ordinary orchestral string writing.
 *
 * This is an M1 subset (adjacent strings, stopped notes only — harmonics bypass in caller).
 */

function isOpenStop(s: Stop): boolean {
  return !s.naturalHarmonic && s.stopIndex <= 0
}

function hasOpenString(stops: Stop[]): boolean {
  return stops.some(isOpenStop)
}

/** Interval class 0–11 from semitone distance between the two pitches. */
function intervalClass(semitones: number): number {
  const d = Math.abs(semitones)
  return d % 12
}

/**
 * Two stops on adjacent violin strings; uses pitch (not string order) for the interval.
 */
export function violinDoubleStopForsythCompatible(stops: Stop[]): boolean {
  if (stops.length !== 2) return true
  const sorted = stops.slice().sort((x, y) => x.stringIndex - y.stringIndex)
  const a = sorted[0]
  const b = sorted[1]
  if (a === undefined || b === undefined) return false
  if (Math.abs(a.stringIndex - b.stringIndex) !== 1) return false

  const lo = Math.min(a.noteNumber, b.noteNumber)
  const hi = Math.max(a.noteNumber, b.noteNumber)
  const ic = intervalClass(hi - lo)

  // Augmented fourth / diminished fifth class
  if (ic === 6) return false

  // Minor second (and compound minor seconds): Forsyth stresses caution; allow with open string
  if (ic === 1) return hasOpenString(stops)

  // Core orchestral intervals: unison/octave family, seconds (major), thirds through sevenths
  const allowedIc = new Set([0, 2, 3, 4, 5, 7, 8, 9, 10, 11])
  return allowedIc.has(ic)
}
