<template>
  <div>
    <a class="button is-warning is-small" @click="openModal">Details...</a>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="showModal = false"></div>
      <div class="modal-card has-text-left">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <slot name="header"></slot>
          </p>
          <button class="delete" aria-label="close" @click="showModal = false"></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot">
          <p>Press <span class="is-family-monospace">Escape</span> or click the close button to return to Syntacticus</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showModal: false,
    }
  },

  methods: {
    openModal() {
      this.showModal = true
    },

    onKeydown(e) {
      if (this.showModal && e.keyCode === 27) {
        this.showModal = false
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.onKeydown)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
  }
}
</script>
