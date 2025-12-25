import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Tokens from '@/components/Tokens.vue'
import Pagination from '@/components/Pagination.vue'
import api from '@/api'
import { languages } from '@/shared' // For filteredLanguages
import schema from '@/data/schema.json' // For filters

const localVue = createLocalVue()

// Mock API calls
vi.mock('@/api', () => ({
  default: {
    getTokens: vi.fn(),
    handleError: vi.fn(),
    pushNewQuery: vi.fn(),
  }
}))

// Mock filters
localVue.filter('language', val => languages[val] || val)

describe('Tokens.vue', () => {
  const mockTokens = [
    { id: 1, citation: 'SourceA', abbrev_text_before: 'before', form: 'word', abbrev_text_after: 'after', language: 'lat', sentence: 'lat:1' },
    { id: 2, citation: 'SourceB', abbrev_text_before: 'before2', form: 'word2', abbrev_text_after: 'after2', language: 'grc', sentence: 'grc:2' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTokens.mockResolvedValue({
      data: {
        data: [],
        total: 0
      }
    })
  })

  it('fetches entries on creation', async () => {
    const wrapper = shallowMount(Tokens, {
      localVue,
      stubs: { PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })
    expect(api.getTokens).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(true)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0)) // Wait for promise to resolve
    expect(wrapper.vm.loading).toBe(false)
  })

  it('renders tokens table data', async () => {
    api.getTokens.mockResolvedValue({
      data: {
        data: mockTokens,
        total: 2
      }
    })

    const wrapper = shallowMount(Tokens, {
      localVue,
      stubs: { PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.findAll('table tbody tr').length).toBe(mockTokens.length)
    expect(wrapper.find('table tbody tr').text()).toContain('SourceA')
    expect(wrapper.find('table tbody tr').text()).toContain('word')
  })

  it('updates query and re-fetches on formPattern change', async () => {
    const wrapper = shallowMount(Tokens, {
      localVue,
      stubs: { PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })

    api.getTokens.mockClear() // Clear initial fetch
    api.pushNewQuery.mockClear()

    wrapper.setData({ formPattern: 'new_form' })
    await wrapper.vm.$nextTick()

    expect(api.pushNewQuery).toHaveBeenCalledWith(expect.anything(), { form: 'new_form' })
  })

  it('paginates correctly', async () => {
    api.getTokens.mockResolvedValue({
      data: {
        data: Array(10).fill({}), // 10 items
        total: 25
      }
    })

    const wrapper = shallowMount(Tokens, {
      localVue,
      stubs: { PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.vm.totalPages).toBe(3) // 25 items, 10 per page

    api.getTokens.mockClear()
    wrapper.find('.pagination-next').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.page).toBe(2)
    expect(api.getTokens).toHaveBeenCalled()
  })
})
