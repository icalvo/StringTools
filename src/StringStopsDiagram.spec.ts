import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import StopsDiagram from '@/StringStopsDiagram.vue'
import {createPinia, setActivePinia} from "pinia";

describe('StopsDiagram', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = mount(StopsDiagram, {
      props: {
        instrumentIndex: 0,
        fingerings: [
          [
            { stringIndex: 0, noteNumber: 43, stopIndex: 0 },
            { stringIndex: 1, noteNumber: 50, stopIndex: 0 }
          ]
        ]
      }
    })
    expect(wrapper.html()).toContain('circle')
  })
})
