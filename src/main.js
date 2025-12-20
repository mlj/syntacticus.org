import Vue from 'vue';
import VueInfiniteScroll from 'vue-infinite-scroll';

import App from './App';
import router from './router';
import store from './store';
import filters from './filters';

console.log("Syntacticus build " + document.documentElement.dataset.buildTimestampUtc)

Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.use(filters);

Vue.use(VueInfiniteScroll);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
