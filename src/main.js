// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Analytics from 'vue-ua';
import NProgress from 'vue-nprogress';
import VueGoodWizard from 'vue-good-wizard';
import { formatNumber } from 'accounting';
import VueInfiniteScroll from 'vue-infinite-scroll';
import VueShortkey from 'vue-shortkey';
import Buefy from 'buefy';

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

import App from './App';
import router from './router';
import store from './store';
import _ from './mylodash';
import { languages } from './shared';
import schema from './data/schema.json';

Vue.config.productionTip = false;
Vue.config.performance = true;

if (!Vue.config.devtools) {
  // FIXME: How on earth does one reliably test if this is production or not?!?
  Raven
    .config('https://6845b69e675f492783530c2fe04de556@sentry.io/193600')
    .addPlugin(RavenVue, Vue)
    .install();
} else {
  console.log("Not enabling Sentry");
}

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
  let [p, n, t, m, v, g, c, d, s, i] = f.split('')

  return _.compact([schema.person[p], schema.case[c], schema.number[n], schema.gender[g]]).join(' ')
})

Vue.filter('morphology2', f => {
  let [p, n, t, m, v, g, c, d, s, i] = f.split('')

  return _.compact([schema.tense[t], schema.mood[m], schema.voice[v], schema.degree[d], schema.strength[s]]).join(' ')
})

Vue.use(NProgress, {
  latencyThreshold: 0,
  router: true,
  http: true,
});
Vue.use(VueGoodWizard);
Vue.use(VueInfiniteScroll);
Vue.use(VueShortkey);
Vue.use(Buefy);

const nprogress = new NProgress() // { parent: '.nprogress-container' })

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
  nprogress,
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
