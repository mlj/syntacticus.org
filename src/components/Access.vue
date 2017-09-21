<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('LOAD_SOURCES')
    this.$store.dispatch('LOAD_DICTIONARIES')
  },
}
</script>
