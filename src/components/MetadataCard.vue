<template>
  <div>
    <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
    <br>
    <span class="icon is-small">
      <i class="fab fa-creative-commons"></i>
    </span>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
  </div>
</template>

<script>
export default {
  props: ['treebank']
}
</script>
