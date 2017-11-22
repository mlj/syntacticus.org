<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2">{{ language | language }} dictionary</h1>
        </div>

        <div class="column is-narrow has-text-right">
          <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
          <br>
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
          <br>
          <metadata-modal>
            <p slot="header">
              <strong>{{ language | language }} dictionary</strong>
            </p>

            <p>
              This dictionary is generated from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
            </p>

            <p>
              It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
            </p>

            <p>
              If you want to link to this text you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
            </p>
          </metadata-modal>
        </div>
      </div>

      <nav class="level">
        <div class="level-left">
          <span v-if="language === 'orv'">
            English translations
            <b-switch v-model="rusGlossesEnabled" size="is-small"></b-switch>
            Russian translations
          </span>
        </div>
        <div class="level-right">
          <input class="input" v-model="formPattern" v-shortkey.avoid placeholder="Form">
          <!-- multiselect
            v-model="formPattern"
            :multiple="false"
            :options="formOptions"
            placeholder="Form"
            :value="initialFormPattern"
            @search-change='onFormFilterFind'
            :searchable="true"
            >
          </multiselect -->

          <multiselect
            v-model="pos"
            :multiple="false"
            :options="partOfSpeechOptions"
            placeholder="Part of speech"
            :custom-label="partOfSpeechLabel"
            :show-labels="false"
            :searchable="false"
            >
          </multiselect>
        </div>
      </nav>

      <div class="columns">
        <div class="column" v-if="total > 0">
          <pagination :total-pages="totalPages" :current-page.sync="page">
          </pagination>

          <table class="table is-fullwidth">
            <tbody>
              <tr v-for="lemma in dictionary">
                <td>
                  <router-link :to="{ name: 'lemma', params: { gid: buildLemmaGID(lemma) }}"><span :lang="language">{{ lemma.lemma }}</span><span v-if="lemma.variant">#{{ lemma.variant}}</span> ({{ lemma.part_of_speech | partOfSpeech }})</router-link>

                  <template v-if="language === 'orv'">
                    <template v-if="rusGlossesEnabled">
                      {{ lemma.glosses.rus | printGloss }}
                    </template>
                    <template v-else>
                      {{ lemma.glosses.eng | printGloss }}
                    </template>
                  </template>
                  <template v-else>
                    {{ lemma.glosses.eng | printGloss }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>

          <pagination :total-pages="totalPages" :current-page.sync="page">
          </pagination>
        </div>
        <div class="column" v-else>
          No matches
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import MetadataModal from './MetadataModal';
import Pagination from './Pagination';
import api from '../api';
import schema from '../data/schema.json';
import {
  makeLemmaGID,
  splitDictionaryGID,
  permanentURLs,
  treebankFromGID
} from '../shared';

export default {
  components: {
    Pagination,
    Multiselect,
    MetadataModal,
  },

  props: ['gid'],

  data() {
    return {
      formPattern: this.$route.query.lemma,
      pos: null,

      page: 1,
      total: 0,
      dictionary: [],
      pageSize: 50,

      formOptions: [],
    }
  },

  filters: {
    printGloss(v) {
      return v === undefined ? '' : `‘${v}’`
    }
  },

  computed: {
    ...mapGetters([
      'currentDictionaries',
    ]),

    permanentURL() { return permanentURLs.dictionary(this.gid); },

    splitGID() { return splitDictionaryGID(this.gid); },

    treebank() { return treebankFromGID(this.gid); },

    language() { return this.splitGID.language; },

    totalPages() { return Math.ceil(this.total / this.pageSize); },

    rusGlossesEnabled: {
      get() {
        return this.$store.getters.rusGlossesEnabled
      },

      set(value) {
        this.$store.commit('SET_RUS_GLOSSES_ENABLED', value)
      }
    },

    initialFormPattern() {
      return this.$route.query.form
    },

    partOfSpeechOptions() {
      let k = []
      for (let tag in schema.part_of_speech) {
        k.push({ tag: tag, label: schema.part_of_speech[tag] })
      }
      return k
    },
  },

  created() {
    this.page = +this.$route.query.page || 1;
    this.fetchEntries()
  },

  watch: {
    '$route' (to, from) {
      this.page = +to.query.page || 1;
      this.fetchEntries()
    },

    page(to, from) {
      api.pushNewQuery(this, { page: +to || 1 });
    },

    pos(value) {
      api.pushNewQuery(this, {
        pos: value ? value.tag : null,
        lemma: this.formPattern,
        page: null,
      })
    },

    formPattern(value) {
      api.pushNewQuery(this, {
        pos: this.pos ? this.pos.tag : null,
        lemma: value,
        page: null,
      })
    },
  },

  methods: {
    fetchEntries() {
      let dictionaryParams = {
        part_of_speech: this.$route.query.pos,
        lemma: this.$route.query.lemma,
        offset: (this.page - 1) * this.pageSize,
        limit: this.pageSize,
      }

      if (dictionaryParams.lemma === '' || dictionaryParams.lemma === null || dictionaryParams.lemma === undefined)
        dictionaryParams.lemma = null
      else {
        dictionaryParams.lemma += '*'
        dictionaryParams.lemma = dictionaryParams.lemma.trim()
      }

      return api.getDictionary(this.gid, dictionaryParams).then((response) => {
        this.dictionary = response.data.data
        this.total = response.data.total
      }).catch((error) => api.handleError(error))
    },

    onFormFilterFind(n) {
      // FIXME: make this async search for candidate forms
      this.formOptions = [n]
    },

    buildLemmaGID(lemma) {
      return makeLemmaGID(this.gid, lemma.lemma, lemma.part_of_speech, lemma.variant);
    },

    partOfSpeechLabel({ tag, label }) {
      return label
    },

    onPartOfSpeechFilterChange(n) {
      let newQuery = this.$route.query
      newQuery.part_of_speech = n ? n.tag : null
      newQuery.page = 1

      this.$router.push({
        name: 'dictionary',
        params: this.$route.params,
        query: newQuery
      })
    },
  }
}
</script>
