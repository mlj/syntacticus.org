<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a
      class="pagination-link pagination-previous"
      :disabled="current <= 1"
      @click.prevent="changePage(current - 1)"
      aria-label="Previous page"
    >
      <span class="icon" aria-hidden="true">
        <i class="mdi mdi-chevron-left mdi-24px"></i>
      </span>
    </a>
    <a
      class="pagination-link pagination-next"
      :disabled="current >= totalPages"
      @click.prevent="changePage(current + 1)"
      aria-label="Next page"
    >
      <span class="icon" aria-hidden="true">
        <i class="mdi mdi-chevron-right mdi-24px"></i>
      </span>
    </a>
    <ul class="pagination-list">
      <!-- First Page -->
      <li v-if="hasFirst">
        <a class="pagination-link" @click.prevent="changePage(1)">1</a>
      </li>
      <li v-if="hasFirstEllipsis">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>

      <!-- Pages Range -->
      <li v-for="page in pagesInRange" :key="page">
        <a
          class="pagination-link"
          :class="{ 'is-current': current === page }"
          @click.prevent="changePage(page)"
          :aria-current="current === page ? 'page' : null"
        >
          {{ page }}
        </a>
      </li>

      <!-- Last Page -->
      <li v-if="hasLastEllipsis">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="hasLast">
        <a class="pagination-link" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  model: {
    prop: 'current',
    event: 'change'
  },
  props: {
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    },
    current: {
      type: Number,
      default: 1
    },
    rangeBefore: {
      type: Number,
      default: 1
    },
    rangeAfter: {
      type: Number,
      default: 1
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage)
    },

    pagesInRange() {
      let start = this.current - this.rangeBefore
      let end = this.current + this.rangeAfter

      if (start < 1) start = 1
      if (end > this.totalPages) end = this.totalPages

      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },

    hasFirst() {
      return this.current - this.rangeBefore > 1
    },

    hasLast() {
      return this.current + this.rangeAfter < this.totalPages
    },

    hasFirstEllipsis() {
      return this.current - this.rangeBefore > 2
    },

    hasLastEllipsis() {
      return this.current + this.rangeAfter < this.totalPages - 1
    }
  },

  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages && page !== this.current) {
        this.$emit('change', page)
      }
    }
  }
}
</script>
