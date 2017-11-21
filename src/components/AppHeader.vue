<template>
  <section class="hero is-medium"> <!-- v-shortkey.once="['h']" @shortkey="openModal()" -->
    <div class="hero-head">
      <div class="container">
        <nav class="nav">
          <div class="nav-left">
            <router-link to="/" class="nav-item" exact><img src="../assets/logo.svg" alt="Syntacticus"> SYNTACTICUS</router-link>
          </div>

          <!-- Shared menu -->
          <div class="nav-center">
            <!-- a class="nav-item" href="#"><span class="icon"><i class="fa fa-github"></i></span></a -->
            <!-- a class="nav-item" href="#"><span class="icon"><i class="fa fa-twitter"></i></span></a -->
          </div>

          <!-- Mobile menu -->
          <span class="nav-toggle" @click.prevent="toggleNav" v-bind:class="{ 'is-active': navToggled }">
            <span></span>
            <span></span>
            <span></span>
          </span>

          <!-- Desktop menu -->
          <div class="nav-right nav-menu" v-bind:class="{ 'is-active': navToggled }">
            <!-- a class="nav-item" href="http://johndal.com/blog/syntacticus">News</a -->
            <router-link to="/browse" class="nav-item">Browse</router-link>
            <router-link to="/about" class="nav-item">About</router-link>

            <span class="nav-item">
              <div class="field has-addons">
                <p class="control">
                  <input @keyup.enter="search" v-model="query" class="input" type="text" placeholder=""> <!-- v-shortkey.focus="['s']" -->
                </p>
                <p class="control">
                  <button @click.prevent="search" class="button">Search</button>
                </p>
              </div>
            </span>

            <span class="nav-item">
              <!-- a class="button">
                <span class="icon"><i class="fa fa-twitter"></i></span>
                <span>Tweet</span>
              </a -->

              <!-- a class="button is-primary" href="https://github.com/proiel/proiel-treebank/releases" target="_blank">
                <span class="icon"><i class="fa fa-download"></i></span>
                <span>Download</span>
              </a -->
            </span>
          </div>
        </nav>
      </div>
    </div>

    <modal :visible="showModal" @close="closeModal">
      <p slot="header">Keyboard shortcuts</p>
      <table class="table">
        <thead>
          <tr><th>Keyboard shortcut</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td>S</td><td>Focus search box</td></tr>
          <tr><td>H</td><td>This help table</td></tr>
        </tbody>
      </table>
    </modal>
  </section>
</template>

<script>
import Modal from './Modal';

export default {
  components: {
    Modal,
  },

  data() {
    return {
      navToggled: false,
      showModal: false,
      query: '',
    }
  },

  watch: {
    '$route'(to, from) {
      // Make sure that the nav toggle on mobile is set to false whenever the route
      // changes so we don't navigate to a new route while leaving the nav bar
      // expanded.
      this.navToggled = false;
    },
  },

  methods: {
    toggleNav() {
      this.navToggled = !this.navToggled;
    },

    search() {
      this.$router.push({
        name: 'tokens',
        query: {
          form: this.query
        }
      });
    },

    openModal() { this.showModal = true; },

    closeModal() { this.showModal = false; },
  }
}
</script>
