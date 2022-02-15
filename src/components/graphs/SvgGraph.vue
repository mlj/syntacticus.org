<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <b-dropdown v-model="direction" :triggers="['hover']" aria-role="list">
            <template #trigger>
              <b-button label="Direction" type="is-primary" icon-right="chevron-down"/>
            </template>

            <b-dropdown-item aria-role="listitem" value="TD">Top-down</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" value="LR">Left-right</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="level-item">
          <b-dropdown v-model="layout" v-if="!alignment" :triggers="['hover']" aria-role="list">
            <template #trigger>
              <b-button label="Layout" type="is-primary" icon-right="chevron-down"/>
            </template>

            <span>
              <b-dropdown-item aria-role="listitem" value="modern">Modern</b-dropdown-item>
              <b-dropdown-item aria-role="listitem" value="classic">Classic</b-dropdown-item>
              <b-dropdown-item aria-role="listitem" value="packed">Packed</b-dropdown-item>
            </span>
          </b-dropdown>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item" v-if="responseURL!==null">
          <a class="button" @click="fullscreen">Fullscreen view</a>
        </div>
        <div class="level-item" v-if="responseURL!==null">
          <a class="button" :href="responseURL">Download graph</a>
        </div>
      </div>
    </nav>

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
  ],

  data() {
    return {
      svg: '',
      busy: false,
      layout: 'modern',
      direction: 'LR',
      responseURL: null,
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
        return api.getAlignedGraph(this.gid, { layout: 'aligned-modern', direction: this.direction });
      else
        return api.getGraph(this.gid, { layout: this.layout, direction: this.direction });
    },

    fetch() {
      if (this.gid) {
        return this.fetchAPI().then((response) => {
          // Grab response URL for direct downloads
          this.responseURL = response.request.responseURL;

          let data = response.data || '';
          this.svg = data;
          this.busy = false;
        }).catch(error => {
          api.handleError(error);

          this.responseURL = null;
          this.svg = '';
          this.busy = false;
        });
      } else {
        this.responseURL = null;
        this.svg = '';
      }
    },

    fullscreen() {
      let win = window.open('', "Syntacticus", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
      win.document.body.innerHTML = `<body>${this.svg}</body>`;
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
