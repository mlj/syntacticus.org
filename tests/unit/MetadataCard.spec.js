import { shallowMount } from '@vue/test-utils'
import MetadataCard from '@/components/MetadataCard.vue'

describe('MetadataCard.vue', () => {
  const treebank = {
    name: 'Test Treebank',
    mainURL: 'http://test.com',
    version: '1.0'
  }

  it('renders treebank info', () => {
    const wrapper = shallowMount(MetadataCard, {
      propsData: { treebank }
    })
    expect(wrapper.text()).toContain('Test Treebank')
    expect(wrapper.text()).toContain('version 1.0')
    expect(wrapper.find('a').attributes('href')).toBe('http://test.com')
  })
})
