import { shallowMount } from '@vue/test-utils'
import AppFooter from '@/components/AppFooter.vue'

describe('AppFooter.vue', () => {
  it('renders copyright and license info', () => {
    const wrapper = shallowMount(AppFooter)
    expect(wrapper.text()).toContain('Syntacticus')
    expect(wrapper.text()).toContain('Marius L. Jøhndal')
    expect(wrapper.text()).toContain('MIT license')
    expect(wrapper.text()).toContain('CC BY-NC-SA 4.0')
  })
})
