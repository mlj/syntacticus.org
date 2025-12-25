import Vue from 'vue';
import Router from 'vue-router';

import Welcome from '@/components/Welcome.vue';
import Browse from '@/components/Browse.vue';
import NotFound from '@/components/NotFound.vue';

const Source = () => import('@/components/Source.vue');
const Dictionary = () => import('@/components/Dictionary.vue');
const Lemma = () => import('@/components/Lemma.vue');
const Sentence = () => import('@/components/Sentence.vue');
const AlignedSource = () => import('@/components/AlignedSource.vue');
const Tokens = () => import('@/components/Tokens.vue');
const Search = () => import('@/components/Search.vue');

Vue.use(Router)

export default new Router({
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
  linkActiveClass: 'is-active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
    },

    {
      path: '/browse',
      name: 'browse',
      component: Browse,
    },

    {
      path: '/dictionary/:gid',
      name: 'dictionary',
      component: Dictionary,
      props: true,
    },

    {
      path: '/source/:gid',
      name: 'source',
      component: Source,
      props: true,
    },

    {
      path: '/aligned_source/:gid',
      name: 'aligned_source',
      component: AlignedSource,
      props: true,
    },

    {
      path: '/sentence/:gid',
      name: 'sentence',
      component: Sentence,
      props: true
    },

    {
      path: '/tokens',
      name: 'tokens',
      component: Tokens,
    },

    {
      path: '/lemma/:gid',
      name: 'lemma',
      component: Lemma,
      props: true
    },

    {
      path: '/search',
      name: 'search',
      component: Search,
    },

    {
      path: '*',
      component: NotFound
    }
  ]
});
