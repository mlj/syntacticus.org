import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api';
import staticSchema from '../data/schema.json';

Vue.use(Vuex)

export const storeConfig = {
  state: {
    sources: [],
    dictionaries: [],
    preferences: {
      rusGlossesEnabled: false,
    },
    errorMessage: null,
  },

  actions: {
    LOAD_SOURCES: ({ commit }) => {
      api.getSources().then((response) => {
        commit('SET_SOURCES', {
          // TODO: deal with pagination
          list: response.data.data
        })
      }, (error) => {
        api.handleError(error)
      })
    },

    LOAD_DICTIONARIES: ({ commit }) => {
      api.getDictionaries().then((response) => {
        commit('SET_DICTIONARIES', {
          // TODO: deal with pagination
          list: response.data.data
        })
      }, (error) => {
        api.handleError(error)
      })
    },
  },

  mutations: {
    /* eslint-disable no-param-reassign */
    SET_SOURCES: (state, { list }) => {
      state.sources = list
    },

    SET_DICTIONARIES: (state, { list }) => {
      state.dictionaries = list
    },

    SET_RUS_GLOSSES_ENABLED: (state, value) => {
      state.preferences.rusGlossesEnabled = value
    },

    SET_ERROR_MESSAGE: (state, message) => {
      state.errorMessage = message
    },
    /* eslint-enable no-param-reassign */
  },

  getters: {
    schema: state => staticSchema,

    dictionaries: state => (state.dictionaries || {}),

    sources: state => (state.sources || []),

    sourceLanguages: state => {
      const languages = state.sources.map(s => s.language).sort();
      return [...new Set(languages)]; // sortedUniq equivalent
    },

    rusGlossesEnabled: state => state.preferences.rusGlossesEnabled,

    errorMessage: state => state.errorMessage,
  },
}

const store = new Vuex.Store(storeConfig)

export default store
