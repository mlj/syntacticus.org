import Vue from 'vue';
import Router from 'vue-router';

import Welcome from '@/components/Welcome';
import Browse from '@/components/Browse';
import About from '@/components/About';
//import Dictionary from '@/components/Dictionary';
//import Lemma from '@/components/Lemma';
//import Sentence from '@/components/Sentence';
//import AlignedSource from '@/components/AlignedSource';
import Source from '@/components/Source';
//import Tokens from '@/components/Tokens';
import Search from '@/components/Search';
import BugReport from '@/components/BugReport';
import NotFound from '@/components/NotFound';

const Dictionary = () => import('@/components/Dictionary.vue');
const Lemma = () => import('@/components/Lemma.vue');
const Sentence = () => import('@/components/Sentence.vue');
const AlignedSource = () => import('@/components/AlignedSource.vue');
const Tokens = () => import('@/components/Tokens.vue');

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
      path: '/about',
      name: 'about',
      component: About,
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
      path: '/bugs',
      component: BugReport,
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
})
