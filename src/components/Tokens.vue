<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2">Search treebank</h1>
        </div>
      </div>

      <section>
        <b-field grouped group-multiline>
          <div class="control">
            <input class="input" v-model="formPattern" placeholder="Form">
          </div>

          <part-of-speech-select v-model="pos" />

          <b-select v-model="language">
            <option :value="null">Any language</option>

            <option v-for="(value, key) of filteredLanguages" :value="key" aria-role="listitem">{{value}}</option>
          </b-select>
        </b-field>

        <b-table
          :data="tokens"
          :loading="loading"

          :mobile-cards="false"
          backend-pagination
          paginated
          hoverable

          :current-page.sync="page"
          :pagination-position="paginationPosition"
          :per-page="pageSize"
          :total="total">
          <b-table-column field="citation" label="Location" width="15em" v-slot="props">
            <router-link :to="{ name: 'sentence', params: { gid: props.row.sentence }}">{{ props.row.citation }}</router-link>
          </b-table-column>
          <b-table-column field="before" label="Match in text" width="25em" cellClass="has-text-right" v-slot="props">
            <span :lang="props.row.language">{{ props.row.abbrev_text_before }}</span>
          </b-table-column>
          <b-table-column field="form" centered cellClass="is-primary" v-slot="props">
            <span :lang="props.row.language">{{ props.row.form }}</span>
          </b-table-column>
          <b-table-column field="after" width="25em" class="has-text-left" cellClass="has-text-left" v-slot="props">
            <span :lang="props.row.language">{{ props.row.abbrev_text_after }}</span>
          </b-table-column>
        </b-table>
      </section>
    </div>
  </section>
</template>

<script>
import api from '../api'
import { languages } from '../shared'
import PartOfSpeechSelect from './PartOfSpeechSelect'

export default {
  components: {
    PartOfSpeechSelect,
  },

  data() {
    return {
      tokens: [],

      formPattern: this.$route.query.form,
      language: this.$route.query.language,
      pos: this.$route.query.pos,

      loading: false,
      page: 1,
      pageSize: 10,
      paginationPosition: 'both',
      total: 0,
    }
  },

  created() {
    this.fetchEntries()
  },

  computed: {
    filteredLanguages() {
      return languages
    }
  },

  watch: {
    $route(to, from) {
      this.formPattern = to.query.form
      this.language    = to.query.language
      this.pos         = to.query.pos

      this.fetchEntries()
    },

    page(to, from) {
      this.fetchEntries()
    },

    pos(to) {
      this.updateQuery({ pos: to })
    },

    language(to) {
      this.updateQuery({ language: to })
    },

    formPattern(to) {
      this.updateQuery({ form: to })
    },
  },

  methods: {
    updateQuery(to) {
      this.page = 1
      api.pushNewQuery(this, to)
    },

    fetchEntries() {
      this.loading = true

      let tokenParams = {
        language: this.language,
        form: this.formPattern,
        part_of_speech: this.pos,

        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
      }

      return api.getTokens(tokenParams).then((response) => {
        this.tokens = response.data.data
        this.total = response.data.total
        this.loading = false
      }).catch((error) => {
        this.tokens = []
        this.total = 0
        this.loading = false
        api.handleError(error)
      })
    },
  },
}
</script>
