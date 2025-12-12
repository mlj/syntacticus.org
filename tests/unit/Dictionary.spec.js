import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Dictionary from '@/components/Dictionary.vue'
import Pagination from '@/components/Pagination.vue'
import api from '@/api'
import Vuex from 'vuex'
import schema from '@/data/schema.json' // For filters

const localVue = createLocalVue()
localVue.use(Vuex)

// Mock API calls
jest.mock('@/api', () => ({
  getDictionary: jest.fn(),
  handleError: jest.fn(),
  pushNewQuery: jest.fn(),
}))

// Mock Vuex store for rusGlossesEnabled
const store = new Vuex.Store({
  getters: {
    rusGlossesEnabled: () => false // Default state
  },
  mutations: {
    SET_RUS_GLOSSES_ENABLED: (state, value) => {
      store.getters.rusGlossesEnabled = value // Simulate mutation
    }
  }
})

// Mock filters
localVue.filter('language', val => val.toUpperCase())
localVue.filter('partOfSpeech', val => schema.part_of_speech[val] || val)
localVue.filter('printGloss', val => val)

describe('Dictionary.vue', () => {
  const gid = 'syntacticus:20180920:lat'

  beforeEach(() => {
    jest.clearAllMocks()
    api.getDictionary.mockResolvedValue({
      data: {
        data: [],
        total: 0
      }
    })
  })

  it('fetches entries on creation', async () => {
    const wrapper = shallowMount(Dictionary, {
      localVue,
      store,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })
    expect(api.getDictionary).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(true)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0)) // Wait for promise to resolve
    expect(wrapper.vm.loading).toBe(false)
  })

  it('renders dictionary table data', async () => {
    const mockData = [{ id: 1, lemma: 'dico', part_of_speech: 'V-', glosses: { eng: 'say' } }]
    api.getDictionary.mockResolvedValue({
      data: {
        data: mockData,
        total: 1
      }
    })

    const wrapper = shallowMount(Dictionary, {
      localVue,
      store,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.find('table tbody tr').text()).toContain('dico')
    expect(wrapper.find('table tbody tr').text()).toContain('verb') // partOfSpeechFilter mock
  })

  it('updates query and re-fetches on formPattern change', async () => {
    const wrapper = shallowMount(Dictionary, {
      localVue,
      store,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })

    api.getDictionary.mockClear() // Clear initial fetch
    api.pushNewQuery.mockClear()

    wrapper.setData({ formPattern: 'new_lemma' })
    await wrapper.vm.$nextTick()

    expect(api.pushNewQuery).toHaveBeenCalledWith(expect.anything(), { lemma: 'new_lemma' })
  })

  it('paginates correctly', async () => {
    api.getDictionary.mockResolvedValue({
      data: {
        data: Array(10).fill({}), // 10 items
        total: 25
      }
    })

    const wrapper = shallowMount(Dictionary, {
      localVue,
      store,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, PartOfSpeechSelect: true, RouterLink: RouterLinkStub, Pagination },
      mocks: {
        $route: { query: {} }
      }
    })
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.vm.totalPages).toBe(3) // 25 items, 10 per page

    api.getDictionary.mockClear()
    wrapper.find('.pagination-next').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.page).toBe(2)
    expect(api.getDictionary).toHaveBeenCalled()
  })
})
