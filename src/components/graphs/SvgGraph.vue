<template>
  <div>
    <div v-html="svg" class="svg-container has-text-centered">
    </div>
  </div>
</template>

<script>
import api from '../../api';

export default {
  props: [
    'gid',
    'alignment',
    'layout',
    'direction'
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

    direction (to, from) {
      this.fetch();
    },

    layout (to, from) {
      this.fetch();
    },
  },

  methods: {
    fetchAPI() {
      if (this.alignment)
        return api.getAlignedGraph(this.gid, { layout: 'aligned-modern', direction: this.direction || 'LR' });
      else
        return api.getGraph(this.gid, { layout: this.layout || 'modern', direction: this.direction || 'LR' });
    },

    fetch() {
      if (this.gid) {
        this.busy = true; // Set busy status
        return this.fetchAPI().then((response) => {
          let responseURL = response.request.responseURL;
          let data = response.data || '';
          this.svg = data;
          this.busy = false; // Reset busy status
          this.$emit('graph-loaded', { url: responseURL, svg: data });
        }).catch(error => {
          api.handleError(error);
          this.svg = '';
          this.busy = false; // Reset busy status
          this.$emit('graph-loaded', { url: null, svg: '' });
        });
      } else {
        this.svg = '';
      }
    },
  }
}
</script>

<style>
.svg-container {
  border: 1px solid #e0e0e0;
  overflow: scroll;
}
</style>
