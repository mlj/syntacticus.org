import Vue from 'vue'
import axios from 'axios'
import Raven from 'raven-js';
import Notification from '../components/Notification'

Vue.prototype.$axios = axios

export const SYNTACTICUS_API_BASE = 'http://foni.uio.no:9293/'
//export const SYNTACTICUS_API_BASE = 'http://shuttle:3000/'

const syntacticusBase = axios.create({ baseURL: `${SYNTACTICUS_API_BASE}/` })

// Based on https://github.com/fundon/vue-admin/blob/master/src/components/pages/Components/Message.vue
const MessageComponent = Vue.extend(Notification)

const openErrorMessage = (title, msg) => {
  return new MessageComponent({
    el: document.createElement('div'),

    propsData: {
      title: title,
      message: msg,
    }
  })
}

const api = {
  handleError(error) {
    if (error.response) {
      if (error.response.status === 404) {
        openErrorMessage('Page not found', "Oops, we can't find that page! Did you follow an old link?");
      } else if (error.response.status === 429) {
        openErrorMessage('Too many requests', "Whoa there, slow down! If you need access to the raw data you can download it from GitHub.");
      } else {
        openErrorMessage('Unable to load data', "Oops, we couldn't load the data you were looking for! We may have some problems with our server...");
      }
    } else {
      openErrorMessage('Unable to load data', "Oops, we couldn't load the data you were looking for! We may have some problems with our server...");
    }

    Raven.captureException(error);
    console.error(error.message);
  },

  getDictionaries() {
    return syntacticusBase.get('dictionaries');
  },

  getSources() {
    return syntacticusBase.get('sources');
  },

  getSource(gid) {
    return syntacticusBase.get(`sources/${gid}`);
  },

  getChunk(id) {
    return syntacticusBase.get(`chunks/${id}`);
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
