import { shallowMount } from '@vue/test-utils'
import Help from '@/components/Help.vue'

describe('Help.vue', () => {
  it('renders with default title', () => {
    const wrapper = shallowMount(Help)
    expect(wrapper.find('.modal-card-title').text()).toBe('Help')
  })

  it('renders with custom title', () => {
    const wrapper = shallowMount(Help, {
      propsData: { title: 'Custom Help' }
    })
    expect(wrapper.find('.modal-card-title').text()).toBe('Custom Help')
  })

  it('toggles modal visibility on click', async () => {
    const wrapper = shallowMount(Help)
    expect(wrapper.vm.help).toBe(false)
    await wrapper.find('a').trigger('click')
    expect(wrapper.vm.help).toBe(true)
    expect(wrapper.find('.modal').classes()).toContain('is-active')
    await wrapper.find('button.delete').trigger('click')
    expect(wrapper.vm.help).toBe(false)
  })
})
