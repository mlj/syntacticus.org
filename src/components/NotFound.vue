<template>
  <section class="hero is-light">
    <div class="hero-body">
      <div class="content has-text-centered">
      <img src="../assets/logo.svg" width="128">
      <p></p>
      <h2 class="subtitle is-3 is-danger">
        {{ title }}
      </h2>
      <h2 class="subtitle is-5">
        {{ message }}
      </h2>

      <router-link to='/' class="button is-primary is-large"><span>Go back home</span></router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['error'],

  computed: {
    title() {
      return this.error ? this.error.statusCode : 'We cannot find the page you requested'
    },

    message() {
      return this.error ? this.error.message : 'Sorry about that! Did you follow an old link?'
    },

  }
}
</script>

<style scoped>
.title
{
  margin-top: 15px;
  font-size: 5em;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
}
.button
{
  margin-top: 50px;
}
</style>
