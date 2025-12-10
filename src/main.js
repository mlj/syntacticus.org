import Vue from 'vue';
import VueInfiniteScroll from 'vue-infinite-scroll';
import VueShortkey from 'vue-shortkey';
import Buefy from 'buefy';

import App from './App';
import router from './router';
import store from './store';
import filters from './filters';

console.log("Syntacticus build " + document.documentElement.dataset.buildTimestampUtc)

Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.use(filters);

Vue.use(VueInfiniteScroll);

// Avoid triggering keyboard shortcuts, which are enabled in AppHeader's
// outermost section element, in input and textarea fields.
Vue.use(VueShortkey, { prevent: ['input', 'textarea'] });

Vue.use(Buefy)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
