<template>
  <div>
    <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
    <br>
    <b-icon icon="creative-commons" size="is-small"></b-icon>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
  </div>
</template>

<script>
export default {
  props: ['treebank']
}
</script>
