import {describe, it, expect, vi} from 'vitest'

import {mount} from '@vue/test-utils'
import StopsDiagram from '@/StringStopsDiagram.vue'
import { createTestingPinia } from '@pinia/testing'
import type {FingeringToggle} from "string-fingerings";

describe('StopsDiagram', () => {
  it('renders properly a violin fingering', () => {
    const fingerings: FingeringToggle[] = [
      {enabled:true, fingering:[
          {stringIndex: 0, noteNumber: 55, stopIndex: 0, naturalHarmonic: false},
          {stringIndex: 1, noteNumber: 62, stopIndex: 0, naturalHarmonic: false}
        ]}
    ]
    const wrapper = mount(StopsDiagram, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: { fingerings: { fingeringToggles: fingerings } }
          })
        ]
      },
      props: {
        instrumentIndex: 0
      }
    })
    
    const fingering1Draw = wrapper.findAll("circle[class='fingering1']")
    expect(fingering1Draw).toHaveLength(2)
    for (const element of fingering1Draw) {
      expect(element.attributes().stroke).toBe('hsl(0 100% 50%)')
    }
    expect(wrapper.findAll("circle[class='fingering2']")).toHaveLength(0)
    expect(wrapper.attributes().style).toContain('violin_front.jpg')
  })

  it('renders properly a cello fingering', () => {
    const fingerings: FingeringToggle[] = [
      {enabled:true, fingering:[
          {stringIndex: 0, noteNumber: 55, stopIndex: 0, naturalHarmonic: false},
          {stringIndex: 1, noteNumber: 62, stopIndex: 0, naturalHarmonic: false}
        ]}
    ]
    const wrapper = mount(StopsDiagram, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: { fingerings: { fingeringToggles: fingerings } }
          })
        ]
      },
      props: {
        instrumentIndex: 2
      }
    })
    expect(wrapper.findAll("circle[class='fingering1']")).toHaveLength(2)
    expect(wrapper.attributes().style).toContain('cello_front.jpg')
  })
})
