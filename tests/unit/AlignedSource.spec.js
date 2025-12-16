import { shallowMount, createLocalVue } from '@vue/test-utils'
import AlignedSource from '@/components/AlignedSource.vue'
import api from '@/api'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

// Mock the API
vi.mock('@/api', () => ({
  default: {
    getSource: vi.fn(),
    getAlignedChunk: vi.fn(),
    handleError: vi.fn()
  }
}))

// Stub Metadata components
const MetadataCardStub = { template: '<div class="metadata-card-stub"></div>', props: ['treebank'] }
const MetadataModalStub = { template: '<div class="metadata-modal-stub"><slot name="header"></slot><slot></slot></div>' }

// Mock IntersectionObserver
const observeMock = vi.fn()
const disconnectMock = vi.fn()
global.IntersectionObserver = vi.fn().mockImplementation(function(callback) {
  return {
    observe: observeMock,
    disconnect: disconnectMock,
    _trigger: (entries) => callback(entries)
  }
})

describe('AlignedSource.vue', () => {
  const gid = 'test:source:gid'

  beforeEach(() => {
    vi.clearAllMocks()

    // Default API responses
    api.getSource.mockResolvedValue({
      data: {
        title: 'Test Aligned Source',
        author: 'Test Author',
        language: 'lat',
        token_count: 100,
        sentence_count: 10,
        alignment: {
          title: 'Aligned Text Title',
          language: 'eng',
          chunk_ids: ['chunk1', 'chunk2', 'chunk3']
        }
      }
    })

    api.getAlignedChunk.mockImplementation((id) => {
      // Mock structure: Array of [SourceSentence, TargetSentence] pairs?
      // Actually AlignedSource.vue iterates: v-for="sentencePair in chunk"
      // Then sentencePair[0] and sentencePair[1].
      // Each is an array of sentences?
      // Let's mock it simply enough to render.
      return Promise.resolve({
        data: [
          // One sentence pair
          [
            [['s1_aligned', 'Sentence 1 aligned content']], // Target?
            [['s1_original', 'Sentence 1 original content']] // Source?
          ]
        ]
      })
    })
  })

  it('loads aligned source metadata and first chunk on creation', async () => {
    const wrapper = shallowMount(AlignedSource, {
      localVue,
      router,
      propsData: { gid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        'router-link': true
      }
    })

    // Wait for fetchEntries -> getSource -> loadChunk -> getAlignedChunk
    await wrapper.vm.$nextTick() // fetchEntries
    await wrapper.vm.$nextTick() // getSource resolved
    await wrapper.vm.$nextTick() // loadChunk called
    await wrapper.vm.$nextTick() // getAlignedChunk resolved

    expect(api.getSource).toHaveBeenCalledWith(gid, {})
    expect(wrapper.vm.title).toBe('Test Aligned Source')
    expect(wrapper.vm.alignment.chunk_ids).toEqual(['chunk1', 'chunk2', 'chunk3'])

    // Should have loaded the first chunk
    expect(api.getAlignedChunk).toHaveBeenCalledWith('chunk1')
    expect(wrapper.vm.loadedChunks.length).toBe(1)
  })

  it('sets up IntersectionObserver on mount', async () => {
    const wrapper = shallowMount(AlignedSource, {
      localVue,
      router,
      propsData: { gid },
      stubs: { MetadataCard: MetadataCardStub, MetadataModal: MetadataModalStub, 'router-link': true }
    })

    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(observeMock).toHaveBeenCalledWith(wrapper.find({ ref: 'sentinel' }).element)
  })

  it('loads next chunk when sentinel intersects', async () => {
    const wrapper = shallowMount(AlignedSource, {
      localVue,
      router,
      propsData: { gid },
      stubs: { MetadataCard: MetadataCardStub, MetadataModal: MetadataModalStub, 'router-link': true }
    })

    // Initial load
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.loadedChunks.length).toBe(1)

    // Trigger intersection
    const observerInstance = global.IntersectionObserver.mock.results[0].value
    observerInstance._trigger([{ isIntersecting: true }])

    // Wait for loadChunk to resolve
    await wrapper.vm.$nextTick() // loadChunk start
    await wrapper.vm.$nextTick() // loadChunk done

    expect(api.getAlignedChunk).toHaveBeenCalledWith('chunk2')
    expect(wrapper.vm.loadedChunks.length).toBe(2)
  })

  it('does not load chunk if busy or not intersecting', async () => {
    const wrapper = shallowMount(AlignedSource, {
      localVue,
      router,
      propsData: { gid },
      stubs: { MetadataCard: MetadataCardStub, MetadataModal: MetadataModalStub, 'router-link': true }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    api.getAlignedChunk.mockClear()

    // Set busy manually
    wrapper.setData({ busy: true })

    const observerInstance = global.IntersectionObserver.mock.results[0].value
    observerInstance._trigger([{ isIntersecting: true }])

    expect(api.getAlignedChunk).not.toHaveBeenCalled()

    wrapper.setData({ busy: false })
    observerInstance._trigger([{ isIntersecting: false }])

    expect(api.getAlignedChunk).not.toHaveBeenCalled()
  })
})
