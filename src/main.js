import Vue from 'vue';
import Analytics from 'vue-ua';
import { formatNumber } from 'accounting';
import VueInfiniteScroll from 'vue-infinite-scroll';
import VueShortkey from 'vue-shortkey';
import Buefy from 'buefy';

import App from './App';
import router from './router';
import store from './store';
import _ from './mylodash';
import { languages } from './shared';
import schema from './data/schema.json';

console.log("Syntacticus build " + document.documentElement.dataset.buildTimestampUtc)

Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.filter('number', v => formatNumber(v));

Vue.filter('language', v => (languages[v] || 'Unknown language'))

Vue.filter('capitalize', v => {
  if (!v)
    return ''
  v = v.toString()
  return v.charAt(0).toUpperCase() + v.slice(1)
})

Vue.filter('partOfSpeech', v => schema.part_of_speech[v] || '')

Vue.filter('morphology1', f => {
  let [p, n, /* t */, /* m */, /* v */, g, c, /* d */, /* s */, /* i */] = f.split('')

  return _.compact([schema.person[p], schema.case[c], schema.number[n], schema.gender[g]]).join(' ')
})

Vue.filter('morphology2', f => {
  let [/* p */, /* n */, t, m, v, /* g /*, /* c */, d, s, /* i */] = f.split('')

  return _.compact([schema.tense[t], schema.mood[m], schema.voice[v], schema.degree[d], schema.strength[s]]).join(' ')
})

Vue.use(VueInfiniteScroll);

// Avoid triggering keyboard shortcuts, which are enabled in AppHeader's
// outermost section element, in input and textarea fields.
Vue.use(VueShortkey, { prevent: ['input', 'textarea'] });

Vue.use(Buefy)

if (!Vue.config.devtools) {
  // FIXME: How on earth does one reliably test if this is production or not?!?
  Vue.use(Analytics, {
    appName: 'Syntacticus',
    appVersion: '0.1.0',
    trackingId: 'UA-41787940-7',
    debug: false,
    vueRouter: router,
  });
} else {
  console.log("Not enabling GA");
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
