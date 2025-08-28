import {defineStore} from 'pinia';
import type { Note, Instrument, InstrumentString } from 'string-fingerings'
import {parse} from 'string-fingerings';

//** Adds UI-related properties to the string-fingerings types */
export interface UiInstrument extends Instrument<UiString> {
  image: string
  clef: 'treble'|'alto'|'tenor'|'bass'
}

//** Adds UI-related properties to the string-fingerings types */
export interface UiString extends InstrumentString {
  startPositionInImage: number[]
  endPositionInImage: number[]
}

interface State {
    instruments: UiInstrument[]
}

export const useInstrumentsStore = defineStore('instruments', {
    state: (): State => ({ instruments: initialInstruments }),
    actions: {
        changeStops(instrumentIndex: number, stops: number) {
            this.instruments[instrumentIndex].stops = stops
        },
        changeOpenNote(instrumentIndex: number, stringIndex: number, openNote: Note) {
            this.instruments[instrumentIndex].strings[stringIndex].openNote = openNote
        },
        changeHighestNote(instrumentIndex: number, stringIndex: number, highestNote: Note) {
            const string = this.instruments[instrumentIndex].strings[stringIndex]
            const newStops = highestNote.number - string.openNote.number
            if (newStops > 0 && newStops <= this.instruments[instrumentIndex].stops)
                string.stops = newStops
        },
    },
})

const initialInstruments: UiInstrument[] = [
    {
        name: 'Violin',
        stops: 24,
        scaleLength: 330,
        image: 'violin_front.jpg',
        clef: 'treble',
        hardStretch: 78,
        maxStretch: 92,
        strings: [
            {
                openNote: parse('G3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                openNote: parse('D4'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                openNote: parse('A4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                openNote: parse('E5'),
                startPositionInImage: [322, 230],
                endPositionInImage: [352, 991]
            }
        ]
    },
    {
        name: 'Viola (16.5")',
        stops: 18,
        scaleLength: 419,
        image: 'viola_front.jpg',
        clef: 'alto',
        hardStretch: 78,
        maxStretch: 92,
        strings: [
            {
                openNote: parse('C3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                openNote: parse('G3'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                openNote: parse('D4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                openNote: parse('A4'),
                startPositionInImage: [322, 230],
                endPositionInImage: [352, 991]
            }
        ]
    },
    {
        name: 'Viola (16")',
        stops: 18,
        scaleLength: 406,
        image: 'viola_front.jpg',
        clef: 'alto',
        hardStretch: 78,
        maxStretch: 92,
        strings: [
            {
                openNote: parse('C3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                openNote: parse('G3'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                openNote: parse('D4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                openNote: parse('A4'),
                startPositionInImage: [322, 230],
                endPositionInImage: [352, 991]
            }
        ]
    },
    {
        name: 'Viola (15.5")',
        stops: 18,
        scaleLength: 394,
        image: 'viola_front.jpg',
        clef: 'alto',
        hardStretch: 78,
        maxStretch: 92,
        strings: [
            {
                openNote: parse('C3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                openNote: parse('G3'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                openNote: parse('D4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                openNote: parse('A4'),
                startPositionInImage: [322, 230],
                endPositionInImage: [352, 991]
            }
        ]
    },
    {
        name: 'Cello',
        stops: 18,
        scaleLength: 690,
        image: 'cello_front.jpg',
        clef: 'bass',
        hardStretch: 78,
        maxStretch: 116,
        strings: [
            {
                openNote: parse('C2'),
                startPositionInImage: [300, 216],
                endPositionInImage: [260, 998]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [310, 215],
                endPositionInImage: [279, 1000]
            },
            {
                openNote: parse('D3'),
                startPositionInImage: [320, 215],
                endPositionInImage: [298, 1001]
            },
            {
                openNote: parse('A3'),
                startPositionInImage: [329, 216],
                endPositionInImage: [316, 1001]
            }
        ]
    },
    {
        name: 'Double bass (5 str. 3/4)',
        stops: 24,
        scaleLength: 1049,
        image: 'bass_front.jpg',
        clef: 'bass',
        hardStretch: 116,
        maxStretch: 120,
        transposition: 12,
        strings: [
            {
                openNote: parse('C1'),
                startPositionInImage: [282, 182],
                endPositionInImage: [265, 990]
            },
            {
                openNote: parse('E1'),
                startPositionInImage: [291, 182],
                endPositionInImage: [285, 991]
            },
            {
                openNote: parse('A1'),
                startPositionInImage: [300, 181],
                endPositionInImage: [307, 991]
            },
            {
                openNote: parse('D2'),
                startPositionInImage: [309, 181],
                endPositionInImage: [329, 990]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [316, 182],
                endPositionInImage: [347, 988]
            }
        ]
    },
    {
        name: 'Double bass (4 str. 3/4)',
        stops: 24,
        scaleLength: 1049,
        image: 'bass4_front.jpg',
        clef: 'bass',
        hardStretch: 116,
        maxStretch: 120,
        transposition: 12,
        strings: [
            {
                openNote: parse('E1'),
                startPositionInImage: [277, 201],
                endPositionInImage: [265, 979]
            },
            {
                openNote: parse('A1'),
                startPositionInImage: [284, 199],
                endPositionInImage: [284, 979]
            },
            {
                openNote: parse('D2'),
                startPositionInImage: [293, 200],
                endPositionInImage: [310, 979]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [302, 201],
                endPositionInImage: [333, 978]
            }
        ]
    },
    {
        name: 'Double bass (4 str. C-ext 3/4)',
        stops: 24,
        scaleLength: 1049,
        image: 'bass4c_front.jpg',
        clef: 'bass',
        hardStretch: 116,
        maxStretch: 120,
        transposition: 12,
        strings: [
            {
                openNote: parse('E1'),
                startPositionInImage: [293, 216],
                endPositionInImage: [275, 979],
                additionalOpenSemitones: [-1,-2,-3,-4],
            },
            {
                openNote: parse('A1'),
                startPositionInImage: [300, 214],
                endPositionInImage: [295, 981]
            },
            {
                openNote: parse('D2'),
                startPositionInImage: [307, 214],
                endPositionInImage: [317, 981]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [315, 215],
                endPositionInImage: [335, 978]
            }
        ]
    },
    {
        name: 'Double bass (5 str. 4/4)',
        stops: 24,
        scaleLength: 1100,
        image: 'bass_front.jpg',
        clef: 'bass',
        hardStretch: 116,
        maxStretch: 120,
        transposition: 12,
        strings: [
            {
                openNote: parse('C1'),
                startPositionInImage: [282, 182],
                endPositionInImage: [265, 990]
            },
            {
                openNote: parse('E1'),
                startPositionInImage: [291, 182],
                endPositionInImage: [285, 991]
            },
            {
                openNote: parse('A1'),
                startPositionInImage: [300, 181],
                endPositionInImage: [307, 991]
            },
            {
                openNote: parse('D2'),
                startPositionInImage: [309, 181],
                endPositionInImage: [329, 990]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [316, 182],
                endPositionInImage: [347, 988]
            }
        ]
    },
    {
        name: 'Double bass (4 str. 4/4)',
        stops: 24,
        scaleLength: 1100,
        image: 'bass4_front.jpg',
        clef: 'bass',
        hardStretch: 116,
        maxStretch: 120,
        transposition: 12,
        strings: [
            {
                openNote: parse('E1'),
                startPositionInImage: [277, 201],
                endPositionInImage: [265, 979]
            },
            {
                openNote: parse('A1'),
                startPositionInImage: [284, 199],
                endPositionInImage: [284, 979]
            },
            {
                openNote: parse('D2'),
                startPositionInImage: [293, 200],
                endPositionInImage: [310, 979]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [302, 201],
                endPositionInImage: [333, 978]
            }
        ]
    },
    {
        name: 'Double bass (4 str. C-ext 4/4)',
        stops: 24,
        scaleLength: 1100,
        image: 'bass4c_front.jpg',
        clef: 'bass',
        hardStretch: 116,
        maxStretch: 120,
        transposition: 12,
        strings: [
            {
                openNote: parse('E1'),
                startPositionInImage: [293, 216],
                endPositionInImage: [275, 979],
                additionalOpenSemitones: [-1,-2,-3,-4],
            },
            {
                openNote: parse('A1'),
                startPositionInImage: [300, 214],
                endPositionInImage: [295, 981]
            },
            {
                openNote: parse('D2'),
                startPositionInImage: [307, 214],
                endPositionInImage: [317, 981]
            },
            {
                openNote: parse('G2'),
                startPositionInImage: [315, 215],
                endPositionInImage: [335, 978]
            }
        ]
    },
]
