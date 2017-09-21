<template>
  <nav class="pagination is-centered">
    <ul class="pagination-list">
      <li>
        <a :disabled="isFirst" class="button" @click='onPrevious'>Previous</a>
      </li>
      <li>&nbsp;</li>
      <li>
        Page {{ currentPage }} of {{ totalPages }}
      </li>
      <li>&nbsp;</li>
      <li>
        <a :disabled="isLast" class="button" @click='onNext'>Next page</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },

    totalPages: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    isFirst() {
      return this.currentPage === 1;
    },

    isLast() {
      return this.currentPage === this.totalPages;
    },
  },

  methods: {
    onPrevious() {
      if (this.currentPage > 1) {
        this.$emit('change', this.currentPage - 1);
        this.$emit('update:currentPage', this.currentPage - 1);
      }
    },

    onNext() {
      if (this.currentPage < this.totalPages) {
        this.$emit('change', this.currentPage + 1);
        this.$emit('update:currentPage', this.currentPage + 1);
      }
    }
  }
}
</script>
