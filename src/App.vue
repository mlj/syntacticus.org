<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'app',

  components: {
    AppHeader,
    AppFooter
  },
}
</script>

<style lang="sass">
@import "./styles/global.sass"
</style>
