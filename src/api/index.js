import Vue from 'vue'
import axios from 'axios'
import * as Sentry from '@sentry/browser';

Vue.prototype.$axios = axios

export const SYNTACTICUS_API_BASE = 'http://foni.uio.no:9293/'
export const STATIC_FILE_BASE = '/data/'

const syntacticusBase = axios.create({ baseURL: `${SYNTACTICUS_API_BASE}/` })

const staticBase = axios.create({ baseURL: `${STATIC_FILE_BASE}/` })

const openErrorMessage = (msg) => {
  Vue.prototype.$toast.open({
    duration: 5000,
    message: msg,
    position: 'is-top',
    type: 'is-danger'
  })
}

const api = {
  handleError(error) {
    console.error('Handling API error: ' + error.message);

    let status = error.response ? error.response.status : null;

    switch (status) {
      case 404:
        openErrorMessage("Oops, we can't find that page! Did you follow an old link?");
        break;

      case 429:
        openErrorMessage("Whoa there, slow down! If you need access to the raw data you can download it from GitHub.");
        break;

      default:
        openErrorMessage("Oops, we couldn't load the data you were looking for! We may have some problems with our server...");

        Sentry.captureException(error);
        break;
    }
  },

  getDictionaries() {
    return staticBase.get('dictionaries.json');
  },

  getSources() {
    return staticBase.get('sources.json');
  },

  getSource(gid) {
    return staticBase.get(`sources/${gid}.json`);
  },

  getChunk(id) {
    return staticBase.get(`chunks/${id}.json`);
  },

  getAlignedChunk(id) {
    return syntacticusBase.get(`aligned_chunks/${id}`);
  },

  getDictionary(gid, params) {
    return syntacticusBase.get(`dictionaries/${gid}/lemmas`, { params: params });
  },

  getLemma(dictionaryGID, lemma, partOfSpeech, variant) {
    if (variant === undefined || variant === null || variant === '')
      return syntacticusBase.get(`dictionaries/${dictionaryGID}/lemmas/${lemma}:${partOfSpeech}`);
    else
      return syntacticusBase.get(`dictionaries/${dictionaryGID}/lemmas/${lemma}:${partOfSpeech}:${variant}`);
  },

  getSentence(sentence) {
    return syntacticusBase.get(`sentences/${sentence}`);
  },

  getTokens(params) {
    return syntacticusBase.get('tokens', { params: params });
  },

  getGraph(gid, params) {
    return syntacticusBase.get(`graphs/${gid}`, { params: params });
  },

  getAlignedGraph(gid, params) {
    return syntacticusBase.get(`aligned_graphs/${gid}`, { params: params });
  },

  pushNewQuery(context, query) {
    // Not quite sure why we need to do this but without it, the route is not updated. See https://forum.vuejs.org/t/vue-2-router-push-query-not-work/1202/4
    let o = {};

    for (let i in context.$route.query)
      o[i] = context.$route.query[i];

    let n = Object.assign(o, query);

    for (let i in n)
      if (o[i] === null || o[i] === undefined || o[i] === '')
        delete o[i];

    context.$router.push({
      name: context.$route.name,
      params: context.$route.params,
      query: n
    });
  }
}

export default api
