<template>
  <div>
    <b-dropdown v-model="params">
      <button class="button is-primary" type="button" slot="trigger">
        <span>Layouts</span>
        <b-icon icon="menu-down"></b-icon>
      </button>

      <b-dropdown-item value="modern:LR">Modern left-right</b-dropdown-item>
      <b-dropdown-item value="modern:TD">Modern top-down</b-dropdown-item>
      <b-dropdown-item value="classic:LR">Classic left-right</b-dropdown-item>
      <b-dropdown-item value="classic:TD">Classic top-down</b-dropdown-item>
      <b-dropdown-item value="packed:LR">Packed left-right</b-dropdown-item>
      <b-dropdown-item value="packed:TD">Packed top-down</b-dropdown-item>
      <!-- b-dropdown-item value="linearized:LR">Linearized left-right</b-dropdown-item>
      <b-dropdown-item value="linearized:TD">Linearized top-down</b-dropdown-item -->
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
  ],

  data() {
    return {
      svg: '',
      busy: false,
      params: 'modern:TD',
    }
  },

  created() {
    this.fetch();
  },

  watch: {
    '$route' (to, from) {
      this.fetch();
    },

    params (to, from) {
      this.fetch();
    }
  },

  methods: {
    fetch() {
      if (this.gid) {
        let p = this.params.split(':');
        return api.getGraph(this.gid, { layout: p[0], direction: p[1] }).then((response) => {
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
