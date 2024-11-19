import { mount } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders msg', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello Vitest')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(MyComponent)
    const button = wrapper.find('button')
    await button.trigger('click')  // Simulate a click event
    expect(wrapper.text()).toContain('1')  // Expect the count to be 1
  })

})
