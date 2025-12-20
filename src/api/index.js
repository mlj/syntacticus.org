import Vue from 'vue'
import store from '../store'

export const SYNTACTICUS_API_BASE = 'https://tekstlab.uio.no/syntacticus-api/'
export const STATIC_FILE_BASE = '/data/'

const openErrorMessage = (msg) => {
  store.commit('SET_ERROR_MESSAGE', msg)
}

const request = async (url, params = {}) => {
  const urlObj = new URL(url, window.location.origin); // Handle relative and absolute URLs
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      urlObj.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(urlObj.toString());
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Simulate Axios structure: response.data
  return { data, request: { responseURL: response.url } }; // Some components might check responseURL
};

const api = {
  handleError(error) {
    console.error('Handling API error: ' + error.message);

    let status = error.status || (error.response ? error.response.status : null);

    switch (status) {
      case 404:
        openErrorMessage("Oops, we can't find that page! Did you follow an old link?");
        break;

      case 429:
        openErrorMessage("Whoa there, slow down! If you need access to the raw data you can download it from GitHub.");
        break;

      default:
        openErrorMessage("Oops, we couldn't load the data you were looking for! We may have some problems with our server...");
        break;
    }
  },

  getDictionaries() {
    return request(`${STATIC_FILE_BASE}dictionaries.json`);
  },

  getSources() {
    return request(`${STATIC_FILE_BASE}sources.json`);
  },

  getSource(gid) {
    return request(`${STATIC_FILE_BASE}sources/${gid}.json`);
  },

  getChunk(id) {
    return request(`${STATIC_FILE_BASE}chunks/${id}.json`);
  },

  getAlignedChunk(id) {
    return request(`${SYNTACTICUS_API_BASE}aligned_chunks/${id}`);
  },

  getDictionary(gid, params) {
    return request(`${SYNTACTICUS_API_BASE}dictionaries/${gid}/lemmas`, params);
  },

  getLemma(dictionaryGID, lemma, partOfSpeech, variant) {
    if (variant === undefined || variant === null || variant === '')
      return request(`${SYNTACTICUS_API_BASE}dictionaries/${dictionaryGID}/lemmas/${lemma}:${partOfSpeech}`);
    else
      return request(`${SYNTACTICUS_API_BASE}dictionaries/${dictionaryGID}/lemmas/${lemma}:${partOfSpeech}:${variant}`);
  },

  getSentence(sentence) {
    return request(`${SYNTACTICUS_API_BASE}sentences/${sentence}`);
  },

  getTokens(params) {
    return request(`${SYNTACTICUS_API_BASE}tokens`, params);
  },

  getGraph(gid, params) {
    return request(`${SYNTACTICUS_API_BASE}graphs/${gid}`, params);
  },

  getAlignedGraph(gid, params) {
    return request(`${SYNTACTICUS_API_BASE}aligned_graphs/${gid}`, params);
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
