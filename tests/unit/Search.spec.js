import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Search from '@/components/Search.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Search.vue', () => {
  let store
  let state
  let router

  beforeEach(() => {
    state = {
      dictionaries: [
        { id: 'lat', name: 'Latin' },
        { id: 'grc', name: 'Greek' }
      ],
      sources: [
        { id: 'src1', title: 'Source 1' },
        { id: 'src2', title: 'Source 2' }
      ]
    }

    store = new Vuex.Store({
      state
    })

    router = {
      push: vi.fn()
    }
  })

  it('renders dropdowns populated from store', () => {
    const wrapper = shallowMount(Search, { store, localVue })

    // Check Language dropdown
    // Note: finding by label text is hard in shallowMount without helpers,
    // relying on structure or v-model binding if possible, but v-model on select
    // is internal.
    // The first select is Language, second is Text.
    const selects = wrapper.findAll('select')

    // Language select
    const langSelect = selects.at(0)
    const langOptions = langSelect.findAll('option')
    expect(langOptions.length).toBe(3) // 1 empty + 2 langs
    expect(langOptions.at(1).text()).toBe('Latin')
    expect(langOptions.at(1).element.value).toBe('lat')

    // Source select
    const sourceSelect = selects.at(1)
    const sourceOptions = sourceSelect.findAll('option')
    expect(sourceOptions.length).toBe(3) // 1 empty + 2 sources
    expect(sourceOptions.at(1).text()).toBe('Source 1')
  })

  it('updates query data when inputs change', async () => {
    const wrapper = shallowMount(Search, { store, localVue })

    const formInput = wrapper.find('input[type="text"]') // The first text input is Form
    await formInput.setValue('amara')

    expect(wrapper.vm.query.form).toBe('amara')
  })

  it('navigates to "tokens" route with query params on search', async () => {
    const wrapper = shallowMount(Search, {
      store,
      localVue,
      mocks: {
        $router: router
      }
    })

    // Simulate user selection
    wrapper.setData({
      query: {
        language: 'lat',
        form: 'test_word',
        part_of_speech: 'V-'
      }
    })

    const button = wrapper.find('button.is-primary')
    await button.trigger('click')

    expect(router.push).toHaveBeenCalledWith({
      name: 'tokens',
      query: expect.objectContaining({
        language: 'lat',
        form: 'test_word',
        part_of_speech: 'V-'
      })
    })
  })
})
