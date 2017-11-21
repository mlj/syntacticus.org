<template>
  <div>
    <a class="button is-warning is-small" @click="openModal">Details...</a>
    <b-modal :active.sync="showModal" class="has-text-left">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <slot name="header"></slot>
          </p>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot">
          <p>Press <span class="is-key">Escape</span> or click the close button to return to Syntacticus</p>
        </footer>
      </div>
    </b-modal>
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
      this.showModal = true;
    },
  }
}
</script>
