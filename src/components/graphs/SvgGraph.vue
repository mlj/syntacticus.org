<template>
  <div>
    <b-dropdown v-model="direction">
      <button class="button is-primary" type="button" slot="trigger">
        <span>Direction</span>
        <b-icon icon="menu-down"></b-icon>
      </button>

      <b-dropdown-item value="TD">Top-down</b-dropdown-item>
      <b-dropdown-item value="LR">Left-right</b-dropdown-item>
    </b-dropdown>

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

    <vis-base>
      <g v-html="svg"></g>
    </vis-base>
  </div>
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
    'alignment',
  ],

  data() {
    return {
      svg: '',
      busy: false,
      layout: 'modern',
      direction: 'LR',
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
          this.svg = response.data || '';
          this.busy = false;
        }).catch(error => {
          api.handleError(error);
          this.busy = false;
        });
      } else {
        this.svg = '';
      }
    }
  }
}
</script>
