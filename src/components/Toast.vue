<template>
  <div class="notification is-danger is-toast" v-if="message">
    <button class="delete" @click="close"></button>
    {{ message }}
  </div>
</template>

<script>
export default {
  computed: {
    message() {
      return this.$store.getters.errorMessage
    }
  },
  methods: {
    close() {
      this.$store.commit('SET_ERROR_MESSAGE', null)
    }
  },
  watch: {
    message(val) {
      if (val) {
        setTimeout(() => {
          this.close()
        }, 5000)
      }
    }
  }
}
</script>

<style scoped>
.is-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 300px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
</style>