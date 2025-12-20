import { shallowMount, createLocalVue } from '@vue/test-utils'
import Sentence from '@/components/Sentence.vue'
import VueRouter from 'vue-router'
import filters from '@/filters'

// Mock the API module
jest.mock('@/api', () => ({
  getSentence: jest.fn(),
  handleError: jest.fn(),
}))

// Import the mocked API
import api from '@/api'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(filters)
const router = new VueRouter()

// Stub child components
const MetadataCardStub = { template: '<div class="metadata-card-stub"></div>', props: ['treebank'] }
const MetadataModalStub = { template: '<div class="metadata-modal-stub"><slot name="header"></slot><slot></slot></div>' }
const SvgGraphStub = { template: '<div class="svg-graph-stub"></div>', props: ['gid', 'alignment'] }

describe('Sentence.vue', () => {
  const mockSentenceGid = 'proiel:20180408:latin-nt:12345'
  const mockMorphology = '3spia-----' // 3rd person, singular, present, indicative, active

  beforeEach(() => {
    jest.clearAllMocks()
    api.getSentence.mockResolvedValue({
      data: {
        source: {
          title: 'Test Text',
          author: 'Test Author',
        },
        tokens: [
          { id: '1', form: 'Sum', lemma: 'sum', part_of_speech: 'V-', variant: null, morphology: mockMorphology },
          { id: '2', form: '.', lemma: '.', part_of_speech: 'PUNC', morphology: null },
        ],
        citation: 'Test Citation',
        language: 'lat',
        previous_gid: 'proiel:20180408:latin-nt:12344',
        next_gid: 'proiel:20180408:latin-nt:12346',
      },
    })
  })

  it('fetches sentence data on creation', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })

    expect(api.getSentence).toHaveBeenCalledWith(mockSentenceGid)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.sentence.source.title).toBe('Test Text')
    expect(wrapper.vm.sentenceID).toBe('12345')
  })

  it('displays basic sentence information', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('h1.title').text()).toBe('Test Text')
    expect(wrapper.find('h2.subtitle').text()).toBe('Test Author')
    expect(wrapper.text()).toContain('Sentence #12345')
    expect(wrapper.text()).toContain('Test Citation')
  })

  it('allows navigation to previous and next sentences', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    const navLinks = wrapper.findAllComponents({ name: 'router-link' })

    // Previous sentence link
    expect(navLinks.at(0).props().to).toEqual({ name: 'sentence', params: { gid: 'proiel:20180408:latin-nt:12344' } })
    expect(navLinks.at(0).text()).toContain('Previous sentence')

    // Next sentence link
    expect(navLinks.at(1).props().to).toEqual({ name: 'sentence', params: { gid: 'proiel:20180408:latin-nt:12346' } })
    expect(navLinks.at(1).text()).toContain('Next sentence')
  })

  it('switches tabs correctly', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    // Default tab is 'lemmas'
    expect(wrapper.vm.activeTab).toBe('lemmas')
    expect(wrapper.find('.interlinear').exists()).toBe(true)

    // Click on 'Morphology & punctuation' tab
    await wrapper.findAll('li a').at(1).trigger('click')
    expect(wrapper.vm.activeTab).toBe('morphology')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.interlinear').exists()).toBe(true)

    // Click on 'Syntax' tab
    await wrapper.findAll('li a').at(2).trigger('click')
    expect(wrapper.vm.activeTab).toBe('syntax')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SvgGraphStub).exists()).toBe(true)
  })

  it('displays token information in "Lemmas & parts of speech" tab', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.activeTab).toBe('lemmas')
    const tokenForms = wrapper.findAll('.interlinear .form')
    const tokenLemmas = wrapper.findAll('.interlinear em')
    const tokenPos = wrapper.findAll('.interlinear .tag')

    expect(tokenForms.at(1).text()).toBe('Sum')
    expect(tokenLemmas.at(0).text()).toBe('sum')
    expect(tokenPos.at(0).text()).toBe('verb')
  })

  it('displays morphology information in "Morphology & punctuation" tab', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    await wrapper.findAll('li a').at(1).trigger('click') // Switch to morphology tab

    expect(wrapper.vm.activeTab).toBe('morphology')
    const morphologySpans = wrapper.findAll('.interlinear .msd')
    // morphology1 filter returns: Person Case Number Gender
    // 3, -, s, - -> "third person singular"
    expect(morphologySpans.at(0).text().trim()).toBe('third person singular')
  })

  it('renders SvgGraph in "Syntax" tab', async () => {
    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    await wrapper.findAll('li a').at(2).trigger('click')
    expect(wrapper.findComponent(SvgGraphStub).props().gid).toBe(mockSentenceGid)
    expect(wrapper.findComponent(SvgGraphStub).props().alignment).toBeUndefined()
  })

  it('renders SvgGraph with alignment prop in "Alignment" tab if alignment exists', async () => {
    api.getSentence.mockResolvedValueOnce({
      data: {
        source: { title: 'Test Text', author: 'Test Author' },
        tokens: [],
        citation: 'Test Citation',
        language: 'got',
        previous_gid: null,
        next_gid: null,
      },
    })

    const wrapper = shallowMount(Sentence, {
      localVue,
      router,
      propsData: { gid: mockSentenceGid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        SvgGraph: SvgGraphStub,
        'router-link': true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.alignment).toBe(true)

    await wrapper.findAll('li a').at(3).trigger('click')
    expect(wrapper.findComponent(SvgGraphStub).props().gid).toBe(mockSentenceGid)
    expect(wrapper.findComponent(SvgGraphStub).props().alignment).toBe(true)
  })
})
