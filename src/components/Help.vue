<template>
  <span>
    <a @click="onClick">
      <b-icon icon="help-circle" size="is-small"></b-icon>
    </a>

    <div class="modal" v-bind:class="{ 'is-active': help }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button class="delete" @click="onClick"></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot is-centered">
          <a class="button is-success" @click="onClick">OK</a>
        </footer>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return 'Help'
      }
    },
  },

  data() {
    return {
      help: false,
    }
  },

  methods: {
    onClick() {
      this.help = !this.help
    },
  }
}
</script>
