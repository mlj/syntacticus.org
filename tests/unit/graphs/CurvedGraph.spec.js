import { shallowMount } from '@vue/test-utils'
import CurvedGraph from '@/components/graphs/CurvedGraph.vue'

describe('CurvedGraph.vue', () => {
  const tokens = [
    { id: 1, form: 'Hello', lemma: 'hello', part_of_speech: 'I-', head_id: 2, relation: 'voc', empty_token_sort: '' },
    { id: 2, form: 'world', lemma: 'world', part_of_speech: 'Nb', head_id: 0, relation: 'pred', empty_token_sort: '' }
  ]

  it('computes nodes correctly', () => {
    const wrapper = shallowMount(CurvedGraph, {
      propsData: { tokens },
      stubs: { VisBase: { template: '<div class="vis-base"><slot /></div>' } },
      filters: { partOfSpeech: v => v }
    })

    // data includes ROOT (id 0) + 2 tokens
    expect(wrapper.vm.data.length).toBe(3)

    // Check ROOT
    const root = wrapper.vm.data.find(n => n.id === 0)
    expect(root).toBeDefined()
    expect(root.word).toBe('ROOT')

    // Check tokens
    const t1 = wrapper.vm.data.find(n => n.id === 1) // Hello
    expect(t1.word).toBe('Hello')
    expect(t1.parent).toBe(2)

    const t2 = wrapper.vm.data.find(n => n.id === 2) // world
    expect(t2.word).toBe('world')
    expect(t2.parent).toBeUndefined() // ROOT parent is undefined in current implementation
  })

  it('renders graph elements', () => {
    const wrapper = shallowMount(CurvedGraph, {
      propsData: { tokens },
      stubs: { VisBase: { template: '<div class="vis-base"><slot /></div>' } },
      filters: { partOfSpeech: v => v }
    })

    const words = wrapper.findAll('.word')
    expect(words.length).toBe(3)

    // Check interaction (selection)
    // <g @mouseover="selected = n.id" ... >
    const tokenGroup = wrapper.findAll('g.token').at(1) // Index 1 is likely 'Hello' (nodes order usually preserved?)

    // Trigger mouseover
    tokenGroup.trigger('mouseover')
    // We can't easily check 'selected' data directly without looking at vm
    expect(wrapper.vm.selected).not.toBe(-1)
  })
})
