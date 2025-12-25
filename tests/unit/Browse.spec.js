import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Browse from '@/components/Browse.vue'
import api from '@/api'

// Mock the API
vi.mock('@/api', () => ({
  default: {
    getSources: vi.fn(),
    getDictionaries: vi.fn(),
    handleError: vi.fn()
  }
}))


const localVue = createLocalVue()
localVue.filter('language', val => val.toUpperCase()) // Simple mock filter

describe('Browse.vue', () => {
  it('fetches data on creation and renders lists', async () => {
    const sources = [
      { id: 's1', language: 'lat', title: 'Source 1', token_count: 100 },
      { id: 's2', language: 'grc', title: 'Source 2', token_count: 200 },
      { id: 's3', language: 'lat', title: 'Source 3', token_count: 50 }
    ]
    const dictionaries = [
      { id: 'd1', language: 'lat' },
      { id: 'd2', language: 'grc' }
    ]

    api.getSources.mockResolvedValue({ data: { data: sources } })
    api.getDictionaries.mockResolvedValue({ data: { data: dictionaries } })

    const wrapper = shallowMount(Browse, {
      localVue,
      stubs: { RouterLink: RouterLinkStub }
    })

    // Wait for promises to resolve (microtasks)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(api.getSources).toHaveBeenCalled()
    expect(api.getDictionaries).toHaveBeenCalled()

    // Check computed properties indirectly via render
    // 'grc' has 200 tokens, 'lat' has 150. So 'grc' should come first in sortedLanguages if sorting by token count descending.
    const languageHeaders = wrapper.findAll('.menu-label')
    expect(languageHeaders.length).toBe(2)
    expect(languageHeaders.at(0).text()).toBe('GRC')
    expect(languageHeaders.at(1).text()).toBe('LAT')

    // Check source links
    const sourceLinks = wrapper.findAllComponents(RouterLinkStub).filter(w => w.props().to.name === 'source')
    expect(sourceLinks.length).toBe(3)
  })

  it('handles API errors', async () => {
    const error = new Error('Failed')
    api.getSources.mockRejectedValue(error)
    api.getDictionaries.mockResolvedValue({ data: { data: [] } })

    const wrapper = shallowMount(Browse, {
      localVue,
      stubs: { RouterLink: RouterLinkStub }
    })

    // Wait for promises
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(api.handleError).toHaveBeenCalledWith(error)
  })
})
