# string-fingerings

Utilities for calculating fingerings on string instruments: parse note names, convert to/from MIDI numbers, and compute all possible fingerings for a set of notes on a configurable instrument (e.g. violin, double bass with extensions).

## Installation

This package is part of the [StringTools](https://github.com/icalvo/StringTools) monorepo and is not published to npm. From the repo root, add it as a workspace dependency (see the root `package.json` `workspaces` field), or use a `file:` dependency pointing at `packages/string-fingerings`.

## Overview

The library provides:

- **Note parsing** — Parse note names (e.g. `C4`, `Bb3`, `F#5`) and pitch classes (e.g. `C`, `Db`) with full enharmonic support (`#`, `b`, `x`, `bb`).
- **MIDI conversion** — Convert between note names and MIDI note numbers (middle C = 60).
- **Instrument model** — Define instruments by strings (open note, optional extra open semitones, max stops) and physical constraints (scale length, stretch limits).
- **Fingering calculation** — Get all valid fingerings for one or more notes, with optional natural harmonics and validation (e.g. stretch, no gaps).

## Core types

- **`Note`** — A note with a specific octave and enharmonic spelling (`name`, `octave`, `alteration`, `number`). Has `text()` and `abcnote()`.
- **`PitchClass`** — Note name + alteration without octave (e.g. `C`, `F#`).
- **`NoteInput`** — `Note | PitchClass`; used when octave may be omitted.
- **`Instrument`** — Instrument definition. Properties:
  - `name` — Name of the instrument.
  - `strings` — Array of strings (each an `InstrumentString`).
  - `stops` — Maximum number of semitones that can be stopped above the open string (default per string unless overridden).
  - `scaleLength` — Length of the vibrating part of the open string (in mm).
  - `hardStretch` — Length (in mm) considered a "hard" stretch between fingers; used for fingering difficulty.
  - `maxStretch` — Maximum stretch length (in mm); fingerings beyond this are rejected when using stretch validations.
  - `transposition` _(optional)_ — For transposing instruments, semitones to add to the written note to get the sounding note (e.g. 12 for double bass).
- **`InstrumentString`** — One string: `openNote` (`Note`), optional `additionalOpenSemitones` (e.g. `[-1,-2,-3,-4]` for a C extension), optional per-string `stops`.
- **`Stop`** — A single fingering: `stringIndex`, `stopIndex` (semitones above open), `noteNumber`, `naturalHarmonic`.

## Note parsing and MIDI

| Function                  | Description                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `parse(noteText)`         | Parse a note name (e.g. `C4`, `Gb5`) and return a `Note`. Throws on error.                 |
| `tryParse(noteText)`      | Like `parse` but returns `Note \| string` (error message).                                 |
| `tryParseInput(noteText)` | Parse with optional octave: with octave → `Note`, without → `PitchClass` (e.g. `C`, `C#`). |
| `isNote(input)`           | Type guard: `true` if `NoteInput` is a `Note`.                                             |
| `noteNumber(noteName)`    | MIDI number for a note name, or a string error message.                                    |
| `nn(noteName)`            | Same as `noteNumber` but throws on invalid input.                                          |
| `noteName(noteNumber)`    | Note name string (e.g. `C4`) for a MIDI number (0-127).                                    |
| `abcnote(noteNumber)`     | ABC notation for a MIDI number.                                                            |

**Example**

```ts
import {
  parse,
  noteNumber,
  noteName,
  tryParseInput,
  isNote,
} from "string-fingerings";

parse("C4"); // Note { name: 'C', octave: 5, number: 60, ... }
noteNumber("C4"); // 60
noteName(60); // 'C4'
noteNumber("Bb3"); // 58

const input = tryParseInput("G");
isNote(input); // false — it's a PitchClass
input.text(); // 'G'
```

## Pitch classes and combinations

| Function                                             | Description                                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `expandPitchClass(pc, minMidi, maxMidi)`             | All `Note`s for that pitch class in the MIDI range.                                            |
| `generateNoteCombinations(inputs, minMidi, maxMidi)` | All `Note[]` combinations; `Note` fixed, `PitchClass` expanded per octave (Cartesian product). |

**Example**

```ts
import {
  tryParseInput,
  expandPitchClass,
  generateNoteCombinations,
  parse,
} from "string-fingerings";

const c = tryParseInput("C");
expandPitchClass(c, 55, 100); // [C4, C5, C6, C7] as Note[]

// One fixed note + one pitch class → several combinations
generateNoteCombinations([c, parse("G5")], 55, 100);
// e.g. [ [C4, G5], [C5, G5], [C6, G5], [C7, G5] ]
```

## Fingerings

| Function                                                                         | Description                                                                                                                                           |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calculateFingerings(instrument, notes, validations?, includeNaturalHarmonics?)` | All valid fingerings for the given MIDI `notes`. Each fingering is a `Stop[]`. Optional `validations`: array of `(instrument, fingering) => boolean`. |
| `getStopRelPos(stopIndex)`                                                       | Relative position on the string (0.0-1.0) for a stop in semitones above open.                                                                         |
| `fingeringHardness(instrument, fingering)`                                       | Stretch "hardness" for a fingering (0.1, 0.5, or 1.0). 1.0 = beyond max stretch.                                                                      |
| `hasNoGaps(_instrument, fingering)`                                              | True if used strings are consecutive (no skipped string).                                                                                             |
| `hasPossibleStretch(instrument, fingering)`                                      | True if fingering is within stretch limits (`fingeringHardness !== 1.0`).                                                                             |

**Example: define an instrument and get fingerings**

```ts
import {
  parse,
  calculateFingerings,
  hasNoGaps,
  hasPossibleStretch,
  type Instrument,
  type InstrumentString,
} from "string-fingerings";

const violin: Instrument<InstrumentString> = {
  name: "Violin",
  stops: 24,
  scaleLength: 330,
  hardStretch: 78,
  maxStretch: 92,
  strings: [
    { openNote: parse("G3") },
    { openNote: parse("D4") },
    { openNote: parse("A4") },
    { openNote: parse("E5") },
  ],
};

// Single note: all ways to play that note
const midiNotes = [72]; // C5
const fingerings = calculateFingerings(violin, midiNotes, [], false);
// e.g. [ [{ stringIndex: 0, stopIndex: 17, noteNumber: 72, naturalHarmonic: false }], ... ]

// Chord with validations: only fingerings with no gaps and possible stretch
const chord = [60, 64, 67]; // C major
const chordFingerings = calculateFingerings(
  violin,
  chord,
  [hasNoGaps, hasPossibleStretch],
  false,
);
```

**Example: double bass with C extension**

```ts
const bassWithCExt: Instrument<InstrumentString> = {
  name: "Double bass with C-ext",
  stops: 24,
  scaleLength: 1049,
  hardStretch: 116,
  maxStretch: 120,
  strings: [
    {
      openNote: parse("E1"),
      additionalOpenSemitones: [-1, -2, -3, -4], // D, Db, C, B
    },
    { openNote: parse("A1") },
    { openNote: parse("D2") },
    { openNote: parse("G2") },
  ],
};

// D1 on C-ext + A1 open
calculateFingerings(bassWithCExt, [38, 45], [], false);
// e.g. [ [{ stringIndex: 0, stopIndex: -2, noteNumber: 38, ... }, { stringIndex: 1, stopIndex: 0, noteNumber: 45, ... }] ]
```

## Note and octave convention

- **Octave** in parsed notes: internal octave is scientific-style (middle C = octave 5). `parse('C4')` gives a note with `number` 60 and internal `octave` 5; `text()` returns `'C4'`.
- **MIDI** note numbers are standard (0-127; middle C = 60).

## License

[MIT](http://opensource.org/licenses/MIT)
