import {defineStore} from 'pinia';
import type { Instrument, InstrumentString } from 'string-fingerings'
import {nn} from 'string-fingerings';

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
        maxStretch: 90,
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
    },
    {
        name: 'Viola (16.5")',
        stops: 18,
        scaleLength: 419,
        image: 'viola_front.jpg',
        clef: 'alto',
        hardStretch: 78,
        maxStretch: 90,
        strings: [
            {
                name: 'C',
                openNote: nn('C3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                name: 'G',
                openNote: nn('G3'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                name: 'D',
                openNote: nn('D4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                name: 'A',
                openNote: nn('A4'),
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
        maxStretch: 90,
        strings: [
            {
                name: 'C',
                openNote: nn('C3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                name: 'G',
                openNote: nn('G3'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                name: 'D',
                openNote: nn('D4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                name: 'A',
                openNote: nn('A4'),
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
        maxStretch: 90,
        strings: [
            {
                name: 'C',
                openNote: nn('C3'),
                startPositionInImage: [287, 229],
                endPositionInImage: [269, 990]
            },
            {
                name: 'G',
                openNote: nn('G3'),
                startPositionInImage: [299, 229],
                endPositionInImage: [297, 990]
            },
            {
                name: 'D',
                openNote: nn('D4'),
                startPositionInImage: [312, 229],
                endPositionInImage: [326, 991]
            },
            {
                name: 'A',
                openNote: nn('A4'),
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
                name: 'C',
                openNote: nn('C2'),
                startPositionInImage: [300, 216],
                endPositionInImage: [260, 998]
            },
            {
                name: 'G',
                openNote: nn('G2'),
                startPositionInImage: [310, 215],
                endPositionInImage: [279, 1000]
            },
            {
                name: 'D',
                openNote: nn('D3'),
                startPositionInImage: [320, 215],
                endPositionInImage: [298, 1001]
            },
            {
                name: 'A',
                openNote: nn('A3'),
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
                name: 'C',
                openNote: nn('C1'),
                startPositionInImage: [282, 182],
                endPositionInImage: [265, 990]
            },
            {
                name: 'E',
                openNote: nn('E1'),
                startPositionInImage: [291, 182],
                endPositionInImage: [285, 991]
            },
            {
                name: 'A',
                openNote: nn('A1'),
                startPositionInImage: [300, 181],
                endPositionInImage: [307, 991]
            },
            {
                name: 'D',
                openNote: nn('D2'),
                startPositionInImage: [309, 181],
                endPositionInImage: [329, 990]
            },
            {
                name: 'G',
                openNote: nn('G2'),
                startPositionInImage: [316, 182],
                endPositionInImage: [347, 988]
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
                name: 'C',
                openNote: nn('C1'),
                startPositionInImage: [282, 182],
                endPositionInImage: [265, 990]
            },
            {
                name: 'E',
                openNote: nn('E1'),
                startPositionInImage: [291, 182],
                endPositionInImage: [285, 991]
            },
            {
                name: 'A',
                openNote: nn('A1'),
                startPositionInImage: [300, 181],
                endPositionInImage: [307, 991]
            },
            {
                name: 'D',
                openNote: nn('D2'),
                startPositionInImage: [309, 181],
                endPositionInImage: [329, 990]
            },
            {
                name: 'G',
                openNote: nn('G2'),
                startPositionInImage: [316, 182],
                endPositionInImage: [347, 988]
            }
        ]
    }
]
