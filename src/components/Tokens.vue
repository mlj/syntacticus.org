<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2">Search treebank</h1>

          <nav class="level">
            <div class="level-left">
            </div>
            <div class="level-right">
              <multiselect
                v-model="searchLanguage"
                placeholder="Language"
                :options="languageOptions"
                label="label"
                :multiple="false"
                :show-labels="false"
                :searchable="false">
              </multiselect>
              <multiselect
                v-model="searchPartOfSpeech"
                placeholder="Part of speech"
                :options="partOfSpeechOptions"
                label="label"
                :multiple="false"
                :show-labels="false"
                :searchable="false">
              </multiselect>
            </div>
          </nav>

          <p>
            <small>
              This table lists all sentences that have a matching token. Click on a row to see more details about the sentence.
            </small>
          </p>

          <div>
            <div class="has-text-centered">
              <strong>{{ total }} matches</strong>
            </div>

            <div><br></div>

            <pagination :total-pages="totalPages" :current-page.sync="page" v-if="total > 0">
            </pagination>

            <div><br></div>

            <b-table :data="tokens" :loading="loading" class="concordance" :hoverable="true">
              <b-table-column field="citation" width="10%" v-slot="props">
                <router-link :to="{ name: 'sentence', params: { gid: props.row.sentence }}">{{ props.row.citation }}</router-link>
              </b-table-column>
              <b-table-column field="before" width="35%" cellClass="has-text-right" v-slot="props">
                <span :lang="props.row.language">{{ props.row.abbrev_text_before }}</span>
              </b-table-column>
              <b-table-column field="form" centered cellClass="is-primary" v-slot="props">
                <span :lang="props.row.language">{{ props.row.form }}</span>
              </b-table-column>
              <b-table-column field="after" class="has-text-left" width="45%" cellClass="has-text-left" v-slot="props">
                <span :lang="props.row.language">{{ props.row.abbrev_text_after }}</span>
              </b-table-column>
            </b-table>

            <div><br></div>

            <pagination :total-pages="totalPages" :current-page.sync="page" v-if="total > 0">
            </pagination>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Pagination from './Pagination'
import api from '../api';
import { languages, partsOfSpeech } from '../shared';
import _ from '../mylodash';

export default {
  components: {
    Multiselect,
    Pagination,
  },

  data() {
    return {
      loading: false,
      page: 1,
      pageSize: 50,
      searchLanguage: null,
      searchPartOfSpeech: null,
      tokens: [],
      total: 0,
    }
  },

  created() {
    this.page = +this.$route.query.page || 1;
    this.fetchEntries();
  },

  mounted() {
    this.handleRouteChange();
  },

  watch: {
    searchLanguage(newValue) {
      api.pushNewQuery(this, {
        language: newValue ? newValue.tag : null,
        page: 1
      })
    },

    searchPartOfSpeech(newValue) {
      api.pushNewQuery(this, {
        part_of_speech: newValue ? newValue.tag : null,
        page: 1
      })
    },

    $route(to, from) {
      this.handleRouteChange();
    },

    page(to, from) {
      api.pushNewQuery(this, { page: +to || 1 });
    },
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },

    query() {
      let to = this.$route;

      return {
        frame_id: to.query.frame_id,
        source: to.query.source,
        language: to.query.language,
        form: to.query.form,
        lemma: to.query.lemma,
        morphology: to.query.morphology,
        part_of_speech: to.query.part_of_speech,
        relation: to.query.relation,
        information_status: to.query.information_status,
        person: to.query.person,
        number: to.query.number,
        tense: to.query.tense,
        mood: to.query.mood,
        voice: to.query.voice,
        gender: to.query.gender,
        case: to.query.case,
        degree: to.query.degree,
        strength: to.query.strength,
        inflection: to.query.inflection,
      }
    },

    languageOptions() { return _.map(languages, (v, k) => ({ tag: k, label: v })); },

    partOfSpeechOptions() { return _.map(partsOfSpeech, (v, k) => ({ tag: k, label: v })); },
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

    handleRouteChange() {
      let l = this.$route.query.language;

      if (l)
        this.searchLanguage = { tag: l, label: languages[l] };
      else
        this.searchLanguage = null;

      l = this.$route.query.part_of_speech;

      if (l)
        this.searchPartOfSpeech = { tag: l, label: partsOfSpeech[l] };
      else
        this.searchPartOfSpeech = null;

      this.page = +this.$route.query.page || 1;
      this.fetchEntries();
    },
  },
}
</script>

<style>
.concordance thead { display: none; }
</style>
