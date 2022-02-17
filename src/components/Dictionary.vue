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
        <b-field grouped group-multiline>
          <div class="control">
            <input class="input" v-model="formPattern" placeholder="Form">
          </div>

          <part-of-speech-select v-model="pos" />

          <div class="control" v-if="language === 'orv'">
            English translations
            <b-switch v-model="rusGlossesEnabled" size="is-small"></b-switch>
            Russian translations
          </div>
        </b-field>

        <b-table
          :data="dictionary"
          :loading="loading"

          :mobile-cards="false"
          backend-pagination
          hoverable
          paginated

          :current-page.sync="page"
          :pagination-position="paginationPosition"
          :per-page="pageSize"
          :total="total">
          <b-table-column field="lemma" label="Lemma" width="15em" v-slot="props">
            <router-link :to="{ name: 'lemma', params: { gid: buildLemmaGID(props.row) }}">
              <i>
                <span :lang="language">{{ props.row.lemma }}</span><span v-if="props.row.variant">#{{ props.row.variant}}</span>
              </i>
            </router-link>
          </b-table-column>

          <b-table-column field="pos" label="Part of speech" width="15em" v-slot="props">
            {{ props.row.part_of_speech | partOfSpeech }}
          </b-table-column>

          <b-table-column field="glosses" label="Glosses" v-slot="props" v-if="language === 'orv'">
            <template v-if="language === 'orv'">
              <template v-if="rusGlossesEnabled">
                {{ props.row.glosses.rus | printGloss }}
              </template>
              <template v-else>
                {{ props.row.glosses.eng | printGloss }}
              </template>
            </template>
            <template v-else>
              {{ props.row.glosses.eng | printGloss }}
            </template>
          </b-table-column>
        </b-table>
      </section>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import MetadataCard from './MetadataCard'
import MetadataModal from './MetadataModal'
import PartOfSpeechSelect from './PartOfSpeechSelect'
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
