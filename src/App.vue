<template>
  <div id="app">
    <app-header />
    <toast />
    <router-view/>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import Toast from './components/Toast'

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
