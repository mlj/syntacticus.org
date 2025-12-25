import { shallowMount } from '@vue/test-utils'
import SvgGraph from '@/components/graphs/SvgGraph.vue'
import api from '@/api'

// Mock API calls
vi.mock('@/api', () => ({
  default: {
    getGraph: vi.fn(),
    getAlignedGraph: vi.fn(),
    handleError: vi.fn(),
  }
}))

describe('SvgGraph.vue', () => {
  const gid = 'test:gid'

  beforeEach(() => {
    vi.clearAllMocks()
    api.getGraph.mockResolvedValue({
      data: '<svg>mock graph</svg>',
      request: { responseURL: 'mock-url-graph' }
    })
    api.getAlignedGraph.mockResolvedValue({
      data: '<svg>mock aligned graph</svg>',
      request: { responseURL: 'mock-url-aligned' }
    })
  })

  it('fetches graph data on creation and emits loaded event', async () => {
    const wrapper = shallowMount(SvgGraph, { 
      propsData: { 
        gid,
        layout: 'modern',
        direction: 'LR'
      } 
    })
    
    expect(api.getGraph).toHaveBeenCalledWith(gid, { layout: 'modern', direction: 'LR' })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.svg).toBe('<svg>mock graph</svg>')
    
    // Check if event was emitted
    expect(wrapper.emitted('graph-loaded')).toBeTruthy()
    expect(wrapper.emitted('graph-loaded')[0]).toEqual([{ url: 'mock-url-graph', svg: '<svg>mock graph</svg>' }])
  })

  it('fetches aligned graph data when alignment prop is true', async () => {
    const wrapper = shallowMount(SvgGraph, { 
      propsData: { 
        gid, 
        alignment: true 
      } 
    })
    
    expect(api.getAlignedGraph).toHaveBeenCalledWith(gid, { layout: 'aligned-modern', direction: 'LR' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.svg).toBe('<svg>mock aligned graph</svg>')
  })

  it('refetches when direction prop changes', async () => {
    const wrapper = shallowMount(SvgGraph, { 
      propsData: { 
        gid,
        layout: 'modern',
        direction: 'LR'
      } 
    })
    api.getGraph.mockClear() // Clear initial fetch

    wrapper.setProps({ direction: 'TD' })
    await wrapper.vm.$nextTick()

    expect(api.getGraph).toHaveBeenCalledWith(gid, { layout: 'modern', direction: 'TD' })
  })

  it('refetches when layout prop changes', async () => {
    const wrapper = shallowMount(SvgGraph, { 
      propsData: { 
        gid,
        layout: 'modern',
        direction: 'LR'
      } 
    })
    api.getGraph.mockClear() // Clear initial fetch

    wrapper.setProps({ layout: 'classic' })
    await wrapper.vm.$nextTick()

    expect(api.getGraph).toHaveBeenCalledWith(gid, { layout: 'classic', direction: 'LR' })
  })
})