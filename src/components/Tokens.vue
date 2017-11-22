<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2">Search treebank</h1>

          <!-- nav class="level">
            <div class="level-left">
            </div>
            <div class="level-right">
              <p class="level-item">
              </p>
              <p class="level-item"><strong>All</strong></p>
              <p class="level-item"><a>Published</a></p>
              <p class="level-item"><a>Drafts</a></p>
              <p class="level-item"><a>Deleted</a></p>
            </div>
          </nav -->

          <!-- input type="text" v-model="form" v-shortkey.avoid>
          <p class="control">
            <button @click.prevent="search" class="button">Search</button>
          </p -->

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

          <concordance :query="query"></concordance>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Concordance from './Concordance';
import api from '../api';
import { languages, partsOfSpeech } from '../shared';
import _ from '../mylodash';

export default {
  components: {
    Concordance,
    Multiselect,
  },

  data() {
    return {
      searchLanguage: null,
      searchPartOfSpeech: null,
    }
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
    }
  },

  computed: {
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
    },
  },
}
</script>
