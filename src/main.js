import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import filters from './filters';

Vue.config.productionTip = false;
Vue.config.performance = true;

Vue.use(filters);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
