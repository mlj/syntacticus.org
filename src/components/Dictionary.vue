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
          <span class="icon"><i class="fa fa-creative-commons"></i></span>
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
          <br>
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

          <b-select v-model="pos">
            <option :value="null">Any part of speech</option>

            <option value="V-">Verbs</option>

            <optgroup label="Nouns">
              <option value="Nb">Common nouns</option>
              <option value="Ne">Proper nouns</option>
            </optgroup>

            <option value="A-">Adjectives</option>

            <optgroup label="Adverbs">
              <option value="Df">Adverbs</option>
              <option value="Dq">Relative adverbs</option>
              <option value="Du">Interrogative adverbs</option>
            </optgroup>

            <optgroup label="Pronouns">
              <option value="Pc">Reciprocal pronouns</option>
              <option value="Pd">Demonstrative pronouns</option>
              <option value="Pi">Interrogative pronouns</option>
              <option value="Pk">Personal reflexive pronouns</option>
              <option value="Pp">Personal pronouns</option>
              <option value="Pr">Relative pronouns</option>
              <option value="Ps">Possessive pronouns</option>
              <option value="Pt">Possessive reflexive pronouns</option>
              <option value="Px">Indefinite pronouns</option>
              <option value="Py">Quantifiers</option>
            </optgroup>

            <optgroup label="Numerals">
              <option value="Ma">Cardinal numerals</option>
              <option value="Mo">Ordinal numerals</option>
            </optgroup>

            <option value="S-">Articles</option>
            <option value="R-">Prepositions</option>
            <option value="N-">Infinitive markers</option>
            <option value="C-">Conjunctions</option>
            <option value="G-">Subjunctions</option>
            <option value="I-">Interjections</option>

            <option value="F-">Foreign words</option>

            <option value="X-">Unassigned words</option>
          </b-select>

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
import { mapGetters } from 'vuex';
import MetadataModal from './MetadataModal';
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
    MetadataModal,
  },

  props: ['gid'],

  data() {
    return {
      loading: false,

      formPattern: this.$route.query.lemma,
      pos: this.$route.query.pos,
      page: +this.$route.query.page || 1,
      total: 0,
      dictionary: [],
      pageSize: 10,
      paginationPosition: 'both',
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

    permanentURL() { return permanentURLs.dictionary(this.gid); },

    splitGID() { return splitDictionaryGID(this.gid); },

    treebank() { return treebankFromGID(this.gid); },

    language() { return this.splitGID.language; },

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
    '$route' (to, from) {
      this.page = +to.query.page || 1;
      this.fetchEntries()
    },

    page(to, from) {
      api.pushNewQuery(this, {
        page: +to || 1
      })
    },

    pos(to, from) {
      api.pushNewQuery(this, {
        pos: to,
        page: 1,
      })
    },

    formPattern(to, from) {
      api.pushNewQuery(this, {
        lemma: to,
        page: 1,
      })
    },
  },

  methods: {
    fetchEntries() {
      this.loading = true;

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
        this.dictionary = response.data.data;
        this.total = response.data.total;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        api.handleError(error);
      });
    },

    buildLemmaGID(lemma) {
      return makeLemmaGID(this.gid, lemma.lemma, lemma.part_of_speech, lemma.variant);
    },
  }
}
</script>
