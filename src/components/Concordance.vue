<template>
  <div>
    <div class="has-text-centered">
      <strong>{{ total }} matches</strong>
    </div>

    <div><br></div>

    <pagination :total-pages="totalPages" :current-page.sync="page" v-if="total > 0">
    </pagination>

    <div><br></div>

    <table class="table">
      <tbody>
        <template v-for="token in tokens">
          <router-link tag="tr" :to="{ name: 'sentence', params: { gid: token.sentence }}">
            <td width="10%" class="is-hidden-mobile">{{ token.citation }}</td>
            <td class="has-text-right" width="35%" :lang="token.language">{{ token.abbrev_text_before }}</td>
            <td class="highlight has-text-centered" :lang="token.language">{{ token.form }}</td>
            <td class="has-text-left" width="45%" :lang="token.language">{{ token.abbrev_text_after }}</td>
          </router-link>
        </template>
      </tbody>
    </table>

    <div><br></div>

    <pagination :total-pages="totalPages" :current-page.sync="page" v-if="total > 0">
    </pagination>
  </div>
</template>

<script>
import Pagination from './Pagination'
import api from '../api'

export default {
  components: {
    Pagination
  },

  data() {
    return {
      page: 1,
      total: 0,
      tokens: [],
      pageSize: 50,
    }
  },

  props: {
    query: {},
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },

  created() {
    this.page = +this.$route.query.page || 1;
    this.fetchEntries();
  },

  watch: {
    '$route'(to, from) {
      this.page = +to.query.page || 1;
      this.fetchEntries();
    },

    page(to, from) {
      api.pushNewQuery(this, { page: +to || 1 });
    },
  },

  methods: {
    fetchEntries() {
      let newQuery = {};
      for (var i in this.query) {
        newQuery[i] = this.query[i];
      }
      newQuery.offset = (this.page - 1) * this.pageSize;
      newQuery.limit = this.pageSize;

      return api.getTokens(newQuery).then((response) => {
        this.tokens = response.data.data;
        this.total = response.data.total;
      }).catch(error => api.handleError(error));
    },
  },
}
</script>
