<template>
  <div id="app">
    <app-header></app-header>
    <!-- level-bar></level-bar -->
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

export default {
  nake: 'app',

  components: {
    AppHeader,
    AppFooter
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="sass">
@import "./styles/global.sass";
</style>
