<!-- This draws heavily on vue-bulma-notification by fundon (MIT) -->
<template>
  <div class="notification is-danger" v-if="show">
    <button class="delete touchable" @click="close()"></button>
    <div class="title is-5" v-if="title">{{ title }}</div>
    <div>{{ message }}</div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    title: String,
    message: String,
  },

  data () {
    return {
      $_parent: null,
      show: true
    }
  },

  created () {
    let $parent = this.$parent

    if (!$parent) {
      let parent = document.querySelector('.notifications')

      if (!parent) {
        const Notifications = Vue.extend({
          name: 'Notifications',

          render (h) {
            return h('div', {
              class: {
                notifications: true
              }
            })
          }
        })

        $parent = new Notifications().$mount()

        document.body.appendChild($parent.$el)
      } else {
        $parent = parent.__vue__
      }
      // Hacked.
      this.$_parent = $parent
    }
  },

  mounted () {
    if (this.$_parent) {
      this.$_parent.$el.appendChild(this.$el)
      this.$parent = this.$_parent
      delete this.$_parent
    }
  },

  destroyed () {
    this.$el.remove()
  },

  methods: {
    close () {
      this.$emit('close')
      this.show = false
      this.$destroy()
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';
@import '~bulma/sass/utilities/mixins';

.notifications {
  position: fixed;
  top: 50px;
  right: 0;
  z-index: 1024 + 233;
  pointer-events: none;

  @include tablet() {
    max-width: 320px;
  }

  .notification {
    margin: 20px;
  }
}

.notification {
  position: relative;
  min-width: 240px;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  pointer-events: all;
}
</style>
