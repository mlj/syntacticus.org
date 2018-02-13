<template>
  <vis-base>
    <g v-html="svg"></g>
  </vis-base>
</template>

<script>
import VisBase from './BaseGraph.vue';
import api from '../../api';

export default {
  components: {
    VisBase
  },

  props: [
    'gid',
  ],

  data() {
    return {
      svg: '',
      busy: false,
    }
  },

  created() {
    this.fetch();
  },

  watch: {
    '$route' (to, from) {
      this.fetch();
    },
  },

  methods: {
    fetch() {
      if (this.gid) {
        return api.getGraph(this.gid).then((response) => {
          this.svg = response.data || '';
          this.busy = false;
        }).catch(error => {
          api.handleAPIError(error);
          this.busy = false;
        });
      } else {
        this.svg = '';
      }
    }
  }
}
</script>