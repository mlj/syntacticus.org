<template>
  <modal :visible="visible" @close="close">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </article>
    </div>
  </modal>
</template>

<script>
import { Modal } from 'vue-bulma-modal'

export default {
  components: {
    Modal
  },

  props: {
    visible: Boolean
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
