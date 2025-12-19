import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Lemma from '@/components/Lemma.vue'
import api from '@/api'
import Buefy from 'buefy'

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.filter('language', v => v) // Mock filters
localVue.filter('partOfSpeech', v => v)

// Mock API
jest.mock('@/api', () => ({
  getLemma: jest.fn(),
  handleError: jest.fn()
}))

describe('Lemma.vue', () => {
  const gid = 'proiel:20180408:lat:dico:V-'

  beforeEach(() => {
    jest.clearAllMocks()
    api.getLemma.mockResolvedValue({
      data: {
        distribution: [],
        glosses: {},
        homographs: [],
        paradigm: {},
        valency: []
      }
    })
  })

  it('fetches data on creation', async () => {
    const wrapper = shallowMount(Lemma, {
      localVue,
      propsData: { gid },
      stubs: {
        MetadataCard: true,
        MetadataModal: true,
        Paradigm: true,
        Valency: true,
        ChartTimeline: true,
        RouterLink: RouterLinkStub
      }
    })

    expect(api.getLemma).toHaveBeenCalledWith(
      'proiel:20180408:lat', 'dico', 'V-', undefined
    )
  })

  it('renders lemma title', async () => {
    const wrapper = shallowMount(Lemma, {
      localVue,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, Paradigm: true, Valency: true, ChartTimeline: true }
    })
    // Wait for promise
    await wrapper.vm.$nextTick()

    const title = wrapper.find('h1.title')
    expect(title.text()).toContain('dico')
  })

  it('determines if paradigm exists', async () => {
    api.getLemma.mockResolvedValue({
      data: {
        paradigm: { 'some-form': 1 },
        distribution: []
      }
    })

    const wrapper = shallowMount(Lemma, {
      localVue,
      propsData: { gid }, // lat is valid for paradigm
      stubs: { MetadataCard: true, MetadataModal: true, Paradigm: true, Valency: true, ChartTimeline: true }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for internal promises if any

    expect(wrapper.vm.hasParadigm).toBe(true)
  })

  it('determines if paradigm does NOT exist (empty)', async () => {
     api.getLemma.mockResolvedValue({
      data: {
        paradigm: {},
        distribution: []
      }
    })

    const wrapper = shallowMount(Lemma, {
      localVue,
      propsData: { gid },
      stubs: { MetadataCard: true, MetadataModal: true, Paradigm: true, Valency: true, ChartTimeline: true }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasParadigm).toBe(false)
  })
})
