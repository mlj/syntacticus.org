<template>
  <div>
    <div class="has-text-centered">
      <strong>{{ total }} matches</strong>
    </div>

    <div><br></div>

    <pagination :total-pages="totalPages" :current-page.sync="page" v-if="total > 0">
    </pagination>

    <div><br></div>

    <b-table
      :data="tokens"
      :loading="loading"
      class="concordance"
      >
      <template slot-scope="props">
        <b-table-column field="citation" width="10%">
          <router-link :to="{ name: 'sentence', params: { gid: props.row.sentence }}">{{ props.row.citation }}</router-link>
        </b-table-column>
        <b-table-column field="before" class="has-text-right" width="35%" :lang="props.row.language">
          {{ props.row.abbrev_text_before }}
        </b-table-column>
        <b-table-column field="form" class="is-primary has-text-centered" :lang="props.row.language">
          {{ props.row.form }}
        </b-table-column>
        <b-table-column field="after" class="has-text-left" width="45%" :lang="props.row.language">
          {{ props.row.abbrev_text_after }}
        </b-table-column>
      </template>
    </b-table>

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
      loading: false,
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
      this.loading = true;
      let newQuery = {};
      for (var i in this.query) {
        newQuery[i] = this.query[i];
      }
      newQuery.offset = (this.page - 1) * this.pageSize;
      newQuery.limit = this.pageSize;

      return api.getTokens(newQuery).then((response) => {
        this.tokens = response.data.data;
        this.total = response.data.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        api.handleError(error);
      });
    },
  },
}
</script>

<style>
.concordance thead { display: none; }
</style>
