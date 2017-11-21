<template>
  <div class="modal animated is-active" v-if="show">
    <div class="modal-background" @click="close">
    </div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <slot name="header"></slot>
        </p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <slot></slot>
      </section>
      <footer class="modal-card-foot">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },

  data () {
    return {
      show: this.visible
    }
  },

  mounted () {
    // TODO: is this really necessary?
    document.body.appendChild(this.$el)
  },

  methods: {
    close () {
      this.$emit('close')
      this.show = false
    }
  },

  watch: {
    visible (v) {
      this.show = v
    }
  }
}
</script>
