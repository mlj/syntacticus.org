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

  it('handles secondary edges correctly', () => {
    const tokensWithSlashes = [
      { id: 1, form: 'A', lemma: 'a', part_of_speech: 'A', head_id: 2, relation: 'sub', empty_token_sort: '' },
      { id: 2, form: 'B', lemma: 'b', part_of_speech: 'B', head_id: 0, relation: 'pred', empty_token_sort: '', slashes: [['xsub', 1]] }
    ]

    const wrapper = shallowMount(CurvedGraph, {
      propsData: { tokens: tokensWithSlashes },
      stubs: { VisBase: { template: '<div class="vis-base"><slot /></div>' } },
      filters: { partOfSpeech: v => v }
    })

    // data includes:
    // ROOT (id 0)
    // Token A (id 1)
    // Token B (id 2)
    // Secondary edge B->A (xsub) (rendered as edge from B to A)
    
    // Total entries in data: 1 (ROOT) + 2 (Tokens) + 1 (Secondary) = 4
    expect(wrapper.vm.data.length).toBe(4)

    const secondary = wrapper.vm.data.find(n => n.isSecondary)
    expect(secondary).toBeDefined()
    expect(secondary.dependency).toBe('xsub')
    expect(secondary.parent).toBe(1) // Target ID is 1 (A)
    // The source ID is 2 (B) because slashes are ON token B pointing TO token A?
    // In XML: <token id="2"><slash target_id="1" relation="xsub" /></token>
    // This means edge FROM 2 TO 1.
    // My implementation: 
    // data.push({ id: indexes[t.id], parent: indexes[targetId] ... })
    // id is source, parent is target.
    // BaseGraph draws edge from 'id' to 'parent'.
    // Wait, BaseGraph logic:
    // item.left = item.id * width
    // item.right = item.parent * width
    // edgePath goes from left to right.
    // So edge connects id and parent.
    // So yes, it represents relation between token and its dependency target.
    // For primary edges: t.id -> t.head_id. (Dependent -> Head).
    // For slashes: t.id -> slash.target_id. (Dependent -> Head).
    // So logic is consistent.
    expect(secondary.id).toBe(2) // Source is B
    
    // Check for level difference to avoid overlap
    // Primary edge B -> ROOT (id 2 -> 0)
    // Secondary edge B -> A (id 2 -> 1)
    // These overlap in range [0, 2].
    // So one should be higher level than the other.
    
    const primaryB = wrapper.vm.data.find(n => n.id === 2 && !n.isSecondary)
    expect(primaryB).toBeDefined()
    
    // Since B->A (2->1) is inside B->ROOT (2->0), 2->1 should be level 1, and 2->0 should be level 2?
    // Or vice versa depending on sort order.
    // They span:
    // Primary: 0 to 2.
    // Secondary: 1 to 2.
    // Overlap exists.
    
    expect(primaryB.level).not.toBe(secondary.level)
  })
})
