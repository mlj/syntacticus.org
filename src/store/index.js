import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from '../mylodash';
import api from '../api';
import staticSchema from '../data/schema.json';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sources: [],
    dictionaries: [],
    preferences: {
      rusGlossesEnabled: false,
    },
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
    /* eslint-enable no-param-reassign */
  },

  getters: {
    schema: state => staticSchema,

    dictionaries: state => (state.dictionaries || {}),

    sources: state => (state.sources || []),

    sourceLanguages: state => (_.sortedUniq(_.map(state.sources, s => s.language).sort())),

    rusGlossesEnabled: state => state.preferences.rusGlossesEnabled,
  },
})

export default store
