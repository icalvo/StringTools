﻿import {defineStore} from "pinia";
import type {FingeringToggle, Stop} from "string-fingerings";

interface State {
    fingeringToggles: FingeringToggle[]
}
export const useFingeringStore = defineStore('fingerings', {
    state: (): State => ({ fingeringToggles: [] }),
    getters: {
        fingerings: (state) => state.fingeringToggles.map(ft => ft.fingering),
    },
    actions: {
        loadFingerings(newFingerings: Stop[][]) {
            this.fingeringToggles = newFingerings.map(f => ({fingering: f, enabled: true }))
        },
        toggleFingering(fingeringIndex: number, enabled: boolean) {
            this.fingeringToggles[fingeringIndex].enabled = enabled
        },
    },
})