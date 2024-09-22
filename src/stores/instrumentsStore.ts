import {defineStore} from "pinia";
import type {Instrument} from "@/packages/string-fingerings";
import {nn} from "@/packages/string-fingerings";

interface State {
    instruments: Instrument[]
}
export const useInstrumentsStore = defineStore('instruments', {
    state: (): State => ({ instruments: initialInstruments }),
    actions: {
        changeStops(instrumentIndex: number, stops: number) {
            this.instruments[instrumentIndex].stops = stops
        },
    },
})

const initialInstruments: Instrument[] = [
    {
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
    },
    {
        name: 'Viola',
        stops: 18,
        scaleLength: 420,
        image: 'viola_front.jpg',
        clef: 'alto',
        hardStretch: 78,
        maxStretch: 116,
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
        name: 'Double bass',
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
