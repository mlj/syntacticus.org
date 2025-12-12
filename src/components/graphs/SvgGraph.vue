<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <div class="dropdown" :class="{ 'is-active': directionDropdownActive }">
            <div class="dropdown-trigger">
              <button class="button is-primary" aria-haspopup="true" aria-controls="dropdown-menu-direction" @click="directionDropdownActive = !directionDropdownActive">
                <span>Direction</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu-direction" role="menu">
              <div class="dropdown-content">
                <a href="#" class="dropdown-item" :class="{ 'is-active': direction === 'TD' }" @click.prevent="setDirection('TD')">Top-down</a>
                <a href="#" class="dropdown-item" :class="{ 'is-active': direction === 'LR' }" @click.prevent="setDirection('LR')">Left-right</a>
              </div>
            </div>
          </div>
        </div>
        <div class="level-item">
          <div class="dropdown" :class="{ 'is-active': layoutDropdownActive }" v-if="!alignment">
            <div class="dropdown-trigger">
              <button class="button is-primary" aria-haspopup="true" aria-controls="dropdown-menu-layout" @click="layoutDropdownActive = !layoutDropdownActive">
                <span>Layout</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu-layout" role="menu">
              <div class="dropdown-content">
                <a href="#" class="dropdown-item" :class="{ 'is-active': layout === 'modern' }" @click.prevent="setLayout('modern')">Modern</a>
                <a href="#" class="dropdown-item" :class="{ 'is-active': layout === 'classic' }" @click.prevent="setLayout('classic')">Classic</a>
                <a href="#" class="dropdown-item" :class="{ 'is-active': layout === 'packed' }" @click.prevent="setLayout('packed')">Packed</a>
              </div>
            </div>
          </div>
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
      directionDropdownActive: false,
      layoutDropdownActive: false,
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
        this.busy = true; // Set busy status
        return this.fetchAPI().then((response) => {
          this.responseURL = response.request.responseURL;
          let data = response.data || '';
          this.svg = data;
          this.busy = false; // Reset busy status
        }).catch(error => {
          api.handleError(error);
          this.responseURL = null;
          this.svg = '';
          this.busy = false; // Reset busy status
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

    setDirection(newDirection) {
      this.direction = newDirection;
      this.directionDropdownActive = false;
    },

    setLayout(newLayout) {
      this.layout = newLayout;
      this.layoutDropdownActive = false;
    }
  }
}
</script>

<style>
.svg-container {
  border: 1px solid #e0e0e0;
  overflow: scroll;
}
</style>
