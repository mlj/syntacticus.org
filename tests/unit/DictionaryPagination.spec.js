import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Dictionary from '@/components/Dictionary.vue'
import Pagination from '@/components/Pagination.vue'
import api from '@/api'
import Vuex from 'vuex'
import schema from '@/data/schema.json'

const localVue = createLocalVue()
localVue.use(Vuex)

// Mock API calls
jest.mock('@/api', () => ({
  getDictionary: jest.fn(),
  handleError: jest.fn(),
  pushNewQuery: jest.fn(),
}))

// Mock Vuex store
const store = new Vuex.Store({
  getters: {
    rusGlossesEnabled: () => false
  },
  mutations: {
    SET_RUS_GLOSSES_ENABLED: (state, value) => {
      store.getters.rusGlossesEnabled = value
    }
  }
})

// Mock filters
localVue.filter('language', val => val)
localVue.filter('partOfSpeech', val => val)
localVue.filter('printGloss', val => val)

describe('Dictionary.vue Pagination', () => {
  const gid = 'test:gid'

  beforeEach(() => {
    jest.clearAllMocks()
    api.getDictionary.mockResolvedValue({
      data: {
        data: Array(10).fill({}),
        total: 25 // 3 pages (10 per page)
      }
    })
  })

  it('disables Previous button on first page', async () => {
    const wrapper = shallowMount(Dictionary, {
      localVue,
      store,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: { $route: { query: {} } }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.vm.page).toBe(1)
    const prevBtn = wrapper.find('.pagination-previous')
    expect(prevBtn.attributes('disabled')).toBe('disabled')

    await prevBtn.trigger('click')
    // Wait for watchers?
    expect(wrapper.vm.page).toBe(1) // Should remain 1
  })

  it('disables Next button on last page', async () => {
    const wrapper = shallowMount(Dictionary, {
      localVue,
      store,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: { $route: { query: {} } }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    wrapper.setData({ page: 3 })
    await wrapper.vm.$nextTick()

    const nextBtn = wrapper.find('.pagination-next')
    expect(nextBtn.attributes('disabled')).toBe('disabled')

    await nextBtn.trigger('click')
    expect(wrapper.vm.page).toBe(3) // Should remain 3
  })
})
