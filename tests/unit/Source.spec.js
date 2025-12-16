import { shallowMount, createLocalVue } from '@vue/test-utils'
import Source from '@/components/Source.vue'
import api from '@/api'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

// Mock the API
vi.mock('@/api', () => ({
  default: {
    getSource: vi.fn(),
    getChunk: vi.fn(),
    handleError: vi.fn()
  }
}))

// Stub Metadata components to avoid deep rendering issues or missing store
const MetadataCardStub = { template: '<div class="metadata-card-stub"></div>', props: ['treebank'] }
const MetadataModalStub = { template: '<div class="metadata-modal-stub"><slot name="header"></slot><slot></slot></div>' }

// Mock IntersectionObserver
const observeMock = vi.fn()
const disconnectMock = vi.fn()
global.IntersectionObserver = vi.fn().mockImplementation(function(callback) {
  return {
    observe: observeMock,
    disconnect: disconnectMock,
    _trigger: (entries) => callback(entries) // Helper to trigger callback manually
  }
})

describe('Source.vue', () => {
  const gid = 'test:source:gid'

  beforeEach(() => {
    vi.clearAllMocks()

    // Default API responses
    api.getSource.mockResolvedValue({
      data: {
        title: 'Test Source',
        author: 'Test Author',
        language: 'lat',
        token_count: 100,
        sentence_count: 10,
        chunks: ['chunk1', 'chunk2', 'chunk3'],
        alignment: {}
      }
    })

    api.getChunk.mockImplementation((id) => {
      return Promise.resolve({
        data: [[`${gid}:1`, 'Sentence 1 content']]
      })
    })
  })

  it('loads source metadata and first chunk on creation', async () => {
    const wrapper = shallowMount(Source, {
      localVue,
      router,
      propsData: { gid },
      stubs: {
        MetadataCard: MetadataCardStub,
        MetadataModal: MetadataModalStub,
        'router-link': true
      }
    })

    // Wait for fetchEntries -> getSource -> loadChunk -> getChunk
    await wrapper.vm.$nextTick() // fetchEntries started
    await wrapper.vm.$nextTick() // getSource resolved
    await wrapper.vm.$nextTick() // loadChunk called
    await wrapper.vm.$nextTick() // getChunk resolved

    expect(api.getSource).toHaveBeenCalledWith(gid)
    expect(wrapper.vm.title).toBe('Test Source')
    expect(wrapper.vm.chunks).toEqual(['chunk1', 'chunk2', 'chunk3'])

    // Should have loaded the first chunk
    expect(api.getChunk).toHaveBeenCalledWith('chunk1')
    expect(wrapper.vm.loadedChunks.length).toBe(1)
  })

  it('sets up IntersectionObserver on mount', async () => {
    const wrapper = shallowMount(Source, {
      localVue,
      router,
      propsData: { gid },
      stubs: { MetadataCard: MetadataCardStub, MetadataModal: MetadataModalStub, 'router-link': true }
    })

    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(observeMock).toHaveBeenCalledWith(wrapper.find({ ref: 'sentinel' }).element)
  })

  it('loads next chunk when sentinel intersects', async () => {
    const wrapper = shallowMount(Source, {
      localVue,
      router,
      propsData: { gid },
      stubs: { MetadataCard: MetadataCardStub, MetadataModal: MetadataModalStub, 'router-link': true }
    })

    // Initial load
    await wrapper.vm.$nextTick() // fetchEntries
    await wrapper.vm.$nextTick() // getSource
    await wrapper.vm.$nextTick() // loadChunk 1 start
    await wrapper.vm.$nextTick() // loadChunk 1 done

    expect(wrapper.vm.loadedChunks.length).toBe(1)

    // Trigger intersection
    const observerInstance = global.IntersectionObserver.mock.results[0].value
    observerInstance._trigger([{ isIntersecting: true }])

    // Wait for loadChunk to resolve
    await wrapper.vm.$nextTick() // loadChunk 2 start
    await wrapper.vm.$nextTick() // loadChunk 2 done (promise resolution)

    expect(api.getChunk).toHaveBeenCalledWith('chunk2')
    expect(wrapper.vm.loadedChunks.length).toBe(2)
  })

  it('does not load chunk if busy or not intersecting', async () => {
    const wrapper = shallowMount(Source, {
      localVue,
      router,
      propsData: { gid },
      stubs: { MetadataCard: MetadataCardStub, MetadataModal: MetadataModalStub, 'router-link': true }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    api.getChunk.mockClear()

    // Set busy manually
    wrapper.setData({ busy: true })

    const observerInstance = global.IntersectionObserver.mock.results[0].value
    observerInstance._trigger([{ isIntersecting: true }])

    expect(api.getChunk).not.toHaveBeenCalled()

    wrapper.setData({ busy: false })
    observerInstance._trigger([{ isIntersecting: false }])

    expect(api.getChunk).not.toHaveBeenCalled()
  })
})
