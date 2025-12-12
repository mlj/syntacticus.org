import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Tokens from '@/components/Tokens.vue'
import Pagination from '@/components/Pagination.vue'
import api from '@/api'

const localVue = createLocalVue()

// Mock API calls
jest.mock('@/api', () => ({
  getTokens: jest.fn(),
  handleError: jest.fn(),
  pushNewQuery: jest.fn(),
}))

describe('Tokens.vue Pagination', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    api.getTokens.mockResolvedValue({
      data: {
        data: Array(10).fill({}),
        total: 25 // 3 pages (10 per page)
      }
    })
  })

  it('disables Previous button on first page', async () => {
    const wrapper = shallowMount(Tokens, {
      localVue,
      stubs: { PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: { $route: { query: {} } }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.vm.page).toBe(1)
    const prevBtn = wrapper.find('.pagination-previous')
    expect(prevBtn.attributes('disabled')).toBe('disabled')

    await prevBtn.trigger('click')
    expect(wrapper.vm.page).toBe(1)
  })

  it('disables Next button on last page', async () => {
    const wrapper = shallowMount(Tokens, {
      localVue,
      stubs: { PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: { $route: { query: {} } }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    wrapper.setData({ page: 3 })
    await wrapper.vm.$nextTick()

    const nextBtn = wrapper.find('.pagination-next')
    expect(nextBtn.attributes('disabled')).toBe('disabled')

    await nextBtn.trigger('click')
    expect(wrapper.vm.page).toBe(3)
  })
})
