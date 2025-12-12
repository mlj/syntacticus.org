import { shallowMount } from '@vue/test-utils'
import PartOfSpeechSelect from '@/components/PartOfSpeechSelect.vue'

describe('PartOfSpeechSelect.vue', () => {
  it('renders correctly with default value', () => {
    const wrapper = shallowMount(PartOfSpeechSelect)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('option[value="V-"]').exists()).toBe(true) // Verbs option
    expect(wrapper.vm.selected).toBeNull()
  })

  it('sets initial value from prop', () => {
    const wrapper = shallowMount(PartOfSpeechSelect, {
      propsData: { value: 'N-' }
    })
    expect(wrapper.vm.selected).toBe('N-')
    expect(wrapper.find('select').element.value).toBe('N-')
  })

  it('emits input event when value changes', async () => {
    const wrapper = shallowMount(PartOfSpeechSelect)
    const select = wrapper.find('select')

    await select.setValue('A-') // Select Adjectives

    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input[0][0]).toBe('A-')
    expect(wrapper.vm.selected).toBe('A-')
  })
})
