<template>
  <div id="app">
    <app-header />
    <toast />
    <router-view/>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Toast from './components/Toast.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    Toast,
  }
}
</script>

<style lang="sass">
@import "./styles/global.sass"
</style>
