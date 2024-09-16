import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import StopsDiagram from '@/components/StopsDiagram.vue'

describe('StopsDiagram', () => {
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
