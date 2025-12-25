<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2">{{ language | language }} dictionary</h1>
        </div>

        <div class="column is-narrow has-text-right">
          <metadata-card :treebank="treebank" />
          <metadata-modal>
            <template v-slot:header>
              <strong>{{ language | language }} dictionary</strong>
            </template>

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

      <section>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <input class="input" v-model="formPattern" placeholder="Form">
          </div>

          <part-of-speech-select v-model="pos" />

          <div class="control" v-if="language === 'orv'">
            <label class="checkbox">
              English translations
              <input type="checkbox" v-model="rusGlossesEnabled">
              Russian translations
            </label>
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
                <th>Lemma</th>
                <th>Part of speech</th>
                <th v-if="language === 'orv'">Glosses</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="3" class="has-text-centered">Loading...</td>
              </tr>
              <template v-else-if="dictionary.length > 0">
                <tr v-for="props in dictionary" :key="props.id">
                  <td>
                    <router-link :to="{ name: 'lemma', params: { gid: buildLemmaGID(props) }}">
                      <i>
                        <span :lang="language">{{ props.lemma }}</span><span v-if="props.variant">#{{ props.variant}}</span>
                      </i>
                    </router-link>
                  </td>
                  <td>
                    {{ props.part_of_speech | partOfSpeech }}
                  </td>
                  <td v-if="language === 'orv'">
                    <template v-if="language === 'orv'">
                      <template v-if="rusGlossesEnabled">
                        {{ props.glosses.rus | printGloss }}
                      </template>
                      <template v-else>
                        {{ props.glosses.eng | printGloss }}
                      </template>
                    </template>
                    <template v-else>
                      {{ props.glosses.eng | printGloss }}
                    </template>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="3" class="has-text-centered">No data found.</td>
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
import { mapGetters } from 'vuex'
import MetadataCard from './MetadataCard.vue'
import MetadataModal from './MetadataModal.vue'
import PartOfSpeechSelect from './PartOfSpeechSelect.vue'
import Pagination from './Pagination.vue'
import api from '../api'
import schema from '../data/schema.json'
import {
  makeLemmaGID,
  splitDictionaryGID,
  permanentURLs,
  treebankFromGID
} from '../shared'

export default {
  components: {
    MetadataCard,
    MetadataModal,
    PartOfSpeechSelect,
    Pagination,
  },

  props: ['gid'],

  data() {
    return {
      dictionary: [],

      formPattern: this.$route.query.lemma,
      pos: this.$route.query.pos,

      loading: false,
      page: 1,
      pageSize: 10,
      paginationPosition: 'both',
      total: 0,
    }
  },

  filters: {
    printGloss(v) {
      return v === undefined ? '' : v
    }
  },

  computed: {
    ...mapGetters([
      'currentDictionaries',
    ]),

    permanentURL() { return permanentURLs.dictionary(this.gid) },

    splitGID() { return splitDictionaryGID(this.gid) },

    treebank() { return treebankFromGID(this.gid) },

    language() { return this.splitGID.language },

    rusGlossesEnabled: {
      get() {
        return this.$store.getters.rusGlossesEnabled
      },

      set(value) {
        this.$store.commit('SET_RUS_GLOSSES_ENABLED', value)
      }
    },
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },

  created() {
    this.fetchEntries()
  },

  watch: {
    $route(to, from) {
      this.formPattern = to.query.lemma
      this.pos         = to.query.pos

      this.fetchEntries()
    },

    page(to, from) {
      this.fetchEntries()
    },

    pos(to, from) {
      this.updateQuery({ pos: to })
    },

    formPattern(to, from) {
      this.updateQuery({ lemma: to })
    },
  },

  methods: {
    updateQuery(to) {
      this.page = 1
      api.pushNewQuery(this, to)
    },

    fetchEntries() {
      this.loading = true

      let dictionaryParams = {
        lemma: this.$route.query.lemma,
        part_of_speech: this.$route.query.pos,

        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize,
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
        this.loading = false
      }).catch((error) => {
        this.dictionary = []
        this.total = 0
        this.loading = false
        api.handleError(error)
      })
    },

    buildLemmaGID(lemma) {
      return makeLemmaGID(this.gid, lemma.lemma, lemma.part_of_speech, lemma.variant)
    },
  }
}
</script>
