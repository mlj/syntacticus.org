<template>
  <section class="hero is-medium" v-shortkey.once="['h']" @shortkey="openModal()">
    <div class="hero-head">
      <div class="container">
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <router-link to="/" class="navbar-item" exact>
              <img src="../assets/logo.svg" alt="Syntacticus: A treebank of early Indo-European languages" height="32" width="32"> SYNTACTICUS
            </router-link>

            <!-- Mobile menu -->
            <button class="navbar-burger" @click.prevent="toggleNav" v-bind:class="{ 'is-active': navToggled }">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <!-- Desktop menu -->
          <div class="navbar-menu" v-bind:class="{ 'is-active': navToggled }">
            <div class="navbar-start">
            </div>

            <div class="navbar-end">
              <!-- a class="navbar-item" href="http://johndal.com/blog/syntacticus">News</a -->
              <router-link to="/browse" class="navbar-item">Browse</router-link>
              <a class="navbar-item" href="http://dev.syntacticus.org">About</a>

              <div class="navbar-item">
                <div class="field has-addons">
                  <p class="control">
                    <input @keyup.enter="search" v-model="query" class="input" type="text" placeholder="Press / to focus" v-shortkey.focus="['/']">
                  </p>
                  <p class="control">
                    <button @click.prevent="search" class="button">Search</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <b-modal :active.sync="showModal">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Keyboard shortcuts</p>
        </header>
        <section class="modal-card-body">
          <table class="table is-fullwidth">
            <thead>
              <tr><th>Keyboard shortcut</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td class="is-family-monospace">/</td><td>Focus search box</td></tr>
              <tr><td class="is-family-monospace">J</td><td>Previous page</td></tr>
              <tr><td class="is-family-monospace">K</td><td>Next page</td></tr>
              <tr><td class="is-family-monospace">?</td><td>This help table</td></tr>
            </tbody>
          </table>
        </section>
        <footer class="modal-card-foot">
          <p>Press <span class="is-family-monospace">Escape</span> or click the close button to return to Syntacticus</p>
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      navToggled: false,
      showModal: false,
      query: '',
    }
  },

  watch: {
    $route(to, from) {
      // Make sure that the nav toggle on mobile is set to false whenever the route
      // changes so we don't navigate to a new route while leaving the nav bar
      // expanded.
      this.navToggled = false
    },
  },

  methods: {
    toggleNav() {
      this.navToggled = !this.navToggled
    },

    search() {
      this.$router.push({
        name: 'tokens',
        query: {
          form: this.query
        }
      })
    },

    openModal() { this.showModal = true },
  }
}
</script>
