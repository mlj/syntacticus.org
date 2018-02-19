<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <b-dropdown v-model="direction">
            <button class="button is-primary" type="button" slot="trigger">
              <span>Direction</span>
              <b-icon icon="menu-down"></b-icon>
            </button>

            <b-dropdown-item value="TD">Top-down</b-dropdown-item>
            <b-dropdown-item value="LR">Left-right</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="level-item">
          <b-dropdown v-model="layout" v-if="!alignment">
            <button class="button is-primary" type="button" slot="trigger">
              <span>Layouts</span>
              <b-icon icon="menu-down"></b-icon>
            </button>

            <span>
              <b-dropdown-item value="modern">Modern</b-dropdown-item>
              <b-dropdown-item value="classic">Classic</b-dropdown-item>
              <b-dropdown-item value="packed">Packed</b-dropdown-item>
            </span>
          </b-dropdown>
        </div>
      </div>
      <div class="level-right">
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
  }
}
</script>

<style>
.svg-container {
  border: 1px solid #e0e0e0;
  overflow: scroll;
}
</style>