<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2">Search treebank</h1>
        </div>
      </div>

      <section>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <input class="input" v-model="formPattern" placeholder="Form">
          </div>

          <part-of-speech-select v-model="pos" />

          <div class="control">
            <div class="select">
              <select v-model="language">
                <option :value="null">Any language</option>
                <option v-for="(value, key) of filteredLanguages" :value="key" :key="key">{{value}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <pagination
                v-model="page"
                :total="total"
                :per-page="pageSize"
              />
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Location</th>
                <th class="has-text-right">Match in text</th>
                <th class="has-text-centered">Form</th>
                <th class="has-text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4" class="has-text-centered">Loading...</td>
              </tr>
              <template v-else-if="tokens.length > 0">
                <tr v-for="props in tokens" :key="props.id">
                  <td>
                    <router-link :to="{ name: 'sentence', params: { gid: props.sentence }}">{{ props.citation }}</router-link>
                  </td>
                  <td class="has-text-right">
                    <span :lang="props.language">{{ props.abbrev_text_before }}</span>
                  </td>
                  <td class="is-primary has-text-centered">
                    <span :lang="props.language">{{ props.form }}</span>
                  </td>
                  <td class="has-text-left">
                    <span :lang="props.language">{{ props.abbrev_text_after }}</span>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="4" class="has-text-centered">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <pagination
                v-model="page"
                :total="total"
                :per-page="pageSize"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import api from '../api'
import { languages } from '../shared'
import PartOfSpeechSelect from './PartOfSpeechSelect'
import Pagination from './Pagination'

export default {
  components: {
    PartOfSpeechSelect,
    Pagination,
  },

  data() {
    return {
      tokens: [],

      formPattern: this.$route.query.form,
      language: this.$route.query.language,
      pos: this.$route.query.pos,
      frame_id: this.$route.query.frame_id,

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
    },
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },

  watch: {
    $route(to, from) {
      this.formPattern = to.query.form
      this.language    = to.query.language
      this.pos         = to.query.pos
      this.frame_id    = to.query.frame_id

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
        frame_id: this.frame_id,

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
