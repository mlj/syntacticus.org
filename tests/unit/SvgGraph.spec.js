import { shallowMount } from '@vue/test-utils'
import SvgGraph from '@/components/graphs/SvgGraph.vue'
import api from '@/api'

// Mock API calls
jest.mock('@/api', () => ({
  getGraph: jest.fn(),
  getAlignedGraph: jest.fn(),
  handleError: jest.fn(),
}))

describe('SvgGraph.vue', () => {
  const gid = 'test:gid'

  beforeEach(() => {
    jest.clearAllMocks()
    api.getGraph.mockResolvedValue({
      data: '<svg>mock graph</svg>',
      request: { responseURL: 'mock-url-graph' }
    })
    api.getAlignedGraph.mockResolvedValue({
      data: '<svg>mock aligned graph</svg>',
      request: { responseURL: 'mock-url-aligned' }
    })
  })

  it('fetches graph data on creation', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid } })
    expect(api.getGraph).toHaveBeenCalledWith(gid, { layout: 'modern', direction: 'LR' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.svg).toBe('<svg>mock graph</svg>')
    expect(wrapper.vm.responseURL).toBe('mock-url-graph')
  })

  it('fetches aligned graph data when alignment prop is true', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid, alignment: true } })
    expect(api.getAlignedGraph).toHaveBeenCalledWith(gid, { layout: 'aligned-modern', direction: 'LR' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.svg).toBe('<svg>mock aligned graph</svg>')
  })

  it('switches direction and refetches', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid } })
    api.getGraph.mockClear() // Clear initial fetch

    wrapper.vm.setDirection('TD')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.direction).toBe('TD')
    expect(api.getGraph).toHaveBeenCalledWith(gid, { layout: 'modern', direction: 'TD' })
  })

  it('switches layout and refetches', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid } })
    api.getGraph.mockClear() // Clear initial fetch

    wrapper.vm.setLayout('classic')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.layout).toBe('classic')
    expect(api.getGraph).toHaveBeenCalledWith(gid, { layout: 'classic', direction: 'LR' })
  })

  it('toggles direction dropdown', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid } })
    expect(wrapper.vm.directionDropdownActive).toBe(false)
    wrapper.find('.dropdown-trigger button').trigger('click')
    expect(wrapper.vm.directionDropdownActive).toBe(true)
  })

  it('toggles layout dropdown', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid } })
    expect(wrapper.vm.layoutDropdownActive).toBe(false)
    wrapper.findAll('.dropdown-trigger button').at(1).trigger('click') // Second button for layout
    expect(wrapper.vm.layoutDropdownActive).toBe(true)
  })

  it('closes dropdown when item is selected', async () => {
    const wrapper = shallowMount(SvgGraph, { propsData: { gid } })
    wrapper.vm.directionDropdownActive = true // Manually open

    wrapper.find('.dropdown-content a').trigger('click') // Click first item
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.directionDropdownActive).toBe(false)
  })
})
