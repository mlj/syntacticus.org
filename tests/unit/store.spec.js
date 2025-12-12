import { storeConfig } from '@/store/index'
import api from '@/api'
import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import _ from 'lodash'

// Mock the API
jest.mock('@/api', () => ({
  getSources: jest.fn(),
  getDictionaries: jest.fn(),
  handleError: jest.fn()
}))

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Vuex Store', () => {
  let store
  let state

  beforeEach(() => {
    // Clone the state to ensure isolation
    state = _.cloneDeep(storeConfig.state)
    store = new Vuex.Store({
      ...storeConfig,
      state
    })
    jest.clearAllMocks()
  })

  describe('Mutations', () => {
    it('SET_SOURCES sets the sources list', () => {
      const sources = [{ id: 1, title: 'Source 1' }]
      store.commit('SET_SOURCES', { list: sources })
      expect(store.state.sources).toEqual(sources)
    })

    it('SET_DICTIONARIES sets the dictionaries list', () => {
      const dictionaries = [{ id: 'lat', name: 'Latin' }]
      store.commit('SET_DICTIONARIES', { list: dictionaries })
      expect(store.state.dictionaries).toEqual(dictionaries)
    })

    it('SET_RUS_GLOSSES_ENABLED sets preference', () => {
      store.commit('SET_RUS_GLOSSES_ENABLED', true)
      expect(store.state.preferences.rusGlossesEnabled).toBe(true)
      store.commit('SET_RUS_GLOSSES_ENABLED', false)
      expect(store.state.preferences.rusGlossesEnabled).toBe(false)
    })

    it('SET_ERROR_MESSAGE sets error message', () => {
      store.commit('SET_ERROR_MESSAGE', 'Something went wrong')
      expect(store.state.errorMessage).toBe('Something went wrong')
    })
  })

  describe('Getters', () => {
    it('dictionaries returns dictionaries from state', () => {
      const dicts = [{ id: 'a' }]
      store.commit('SET_DICTIONARIES', { list: dicts })
      expect(store.getters.dictionaries).toEqual(dicts)
    })

    it('sources returns sources from state', () => {
      const sources = [{ id: 'b' }]
      store.commit('SET_SOURCES', { list: sources })
      expect(store.getters.sources).toEqual(sources)
    })

    it('sourceLanguages returns sorted unique languages', () => {
      const sources = [
        { language: 'lat' },
        { language: 'grc' },
        { language: 'lat' }
      ]
      store.commit('SET_SOURCES', { list: sources })
      expect(store.getters.sourceLanguages).toEqual(['grc', 'lat'])
    })

    it('errorMessage returns error message', () => {
      store.commit('SET_ERROR_MESSAGE', 'Error!')
      expect(store.getters.errorMessage).toBe('Error!')
    })
  })

  describe('Actions', () => {
    it('LOAD_SOURCES commits SET_SOURCES on success', async () => {
      const mockData = { data: { data: [{ id: 1 }] } }
      api.getSources.mockResolvedValue(mockData)

      await store.dispatch('LOAD_SOURCES')

      expect(api.getSources).toHaveBeenCalled()
      expect(store.state.sources).toEqual([{ id: 1 }])
    })

    it('LOAD_SOURCES calls handleError on failure', async () => {
      const error = new Error('Network error')
      api.getSources.mockRejectedValue(error)

      await store.dispatch('LOAD_SOURCES')

      expect(api.getSources).toHaveBeenCalled()
      expect(api.handleError).toHaveBeenCalledWith(error)
    })

    it('LOAD_DICTIONARIES commits SET_DICTIONARIES on success', async () => {
      const mockData = { data: { data: [{ id: 'lat' }] } }
      api.getDictionaries.mockResolvedValue(mockData)

      await store.dispatch('LOAD_DICTIONARIES')

      expect(api.getDictionaries).toHaveBeenCalled()
      expect(store.state.dictionaries).toEqual([{ id: 'lat' }])
    })
  })
})