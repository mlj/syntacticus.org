import { RouterLinkStub } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Welcome from '@/components/Welcome.vue'

describe('Welcome.vue', () => {
  it('renders the introductory text', () => {
    const wrapper = shallowMount(Welcome, {
      propsData: { },
      stubs: { RouterLink: RouterLinkStub }
    })
    expect(wrapper.text()).toMatch('Rigorous')
    expect(wrapper.text()).toMatch('Comprehensive')
  })
})
