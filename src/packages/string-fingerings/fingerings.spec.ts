import {describe, expect, it} from "vitest";
import {calculateFingerings, getStopRelPos, hasNoGaps, nn, noteName, noteNumber} from "./fingerings";

describe('noteName', () => {
    it('return C4 for number 60', () => {
        expect(noteName(60)).toBe('C4')
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
        expect(noteNumber('')).to.be.a("string")
    })
    it('returns error message if no valid note is given', () => {
        expect(noteNumber('X5')).toBeTypeOf("string")
    })
    it('returns error message if no octave is given', () => {
        expect(noteNumber('G')).toBeTypeOf("string")
    })
    it('returns error message if an invalid alteration is given', () => {
        expect(noteNumber('Gy6')).toBeTypeOf("string")
    })
    it('returns error message if there are extra chars', () => {
        expect(noteNumber('Gb6!')).toBeTypeOf("string")
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
        expect(getStopRelPos( 0)).toBeCloseTo(0)
        expect(getStopRelPos( 7)).toBeCloseTo(0.33258, 3)
        expect(getStopRelPos(12)).toBeCloseTo(0.5)
        expect(getStopRelPos(24)).toBeCloseTo(0.75)
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
            startPositionInImage: [287, 229],
            endPositionInImage: [269, 990]
        },
        {
            name: 'D',
            openNote: nn('D4'),
            startPositionInImage: [299, 229],
            endPositionInImage: [297, 990]
        },
        {
            name: 'A',
            openNote: nn('A4'),
            startPositionInImage: [312, 229],
            endPositionInImage: [326, 991]
        },
        {
            name: 'E',
            openNote: nn('E5'),
            startPositionInImage: [322, 230],
            endPositionInImage: [352, 991]
        }
    ]
}

describe('hasNoGaps', () => {
    it('Returns expected results', () => {
        expect(hasNoGaps( undefined, [
            { stringIndex: 3 },
            { stringIndex: 4 }])).toBe(true)
        expect(hasNoGaps( undefined, [
            { stringIndex: 1 },
            { stringIndex: 3 }])).toBe(false)
        expect(hasNoGaps( undefined, [
            { stringIndex: 1 },
            { stringIndex: 2 },
            { stringIndex: 4 }])).toBe(false)
    })
})

describe('calculateFingerings', () => {
    it('works with single note', () => {
        expect(calculateFingerings(violin, [60], [], false)).toStrictEqual([
            [{
                "stringIndex": 0,
                "noteNumber": 60,
                "stopIndex": 5,
                "naturalHarmonic": false,
            }]
        ])
    })
    it('works with quadruple stop C-major chord', () => {
        expect(calculateFingerings(violin, [60, 67,72,76], [], false)).toStrictEqual([
            [{
                "stringIndex": 0,
                "noteNumber": 60,
                "naturalHarmonic": false,
                "stopIndex": 5,
            },
            {
                "stringIndex": 1,
                "noteNumber": 67,
                "naturalHarmonic": false,
                "stopIndex": 5,
            },
            {
                "stringIndex": 2,
                "noteNumber": 72,
                "naturalHarmonic": false,
                "stopIndex": 3,
            },
            {
                "stringIndex": 3,
                "noteNumber": 76,
                "naturalHarmonic": false,
                "stopIndex": 0,
            }]
        ])
    })
})
