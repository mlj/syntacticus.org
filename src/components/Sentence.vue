<template>
  <article>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title">{{ sentence.source.title }}</h1>
            <h2 class="subtitle" v-if="sentence.source.author">{{ sentence.source.author }}</h2>

            <p>
              <strong>Sentence #{{ sentenceID }}</strong>
              (<router-link v-if="hasPrevious" :to="{ name: 'sentence', params: { gid: sentence.previous_gid }}">Previous sentence</router-link><span v-if="hasPrevious && hasNext"> | </span><router-link v-if="hasNext" :to="{ name: 'sentence', params: { gid: sentence.next_gid }}">Next sentence</router-link>)
            </p>
          </div>

          <div class="column is-narrow has-text-right">
            <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
            <br>
            <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
            <br>
            {{ sentence.citation }}
            <br>
            <metadata-modal>
              <p slot="header">
                <strong>{{ sentence.source.title }}</strong> <small>({{ sentence.language | language }})</small>
              </p>

              <p>
                This sentence is from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
              </p>

              <p>
                It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
              </p>

              <p>
                If you want to link to this sentence you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
              </p>
            </metadata-modal>
          </div>
        </div>

        <b-tabs position="is-centered">
          <b-tab-item label="Lemmas &amp; parts of speech">
            <div class="interlinear">
              <template v-for="token in selectedTokens">
                <div class="intlin">
                  <span class="form"> </span>
                  <span class="annotation"></span>
                </div>

                <div class="intlin">
                  <span class="form" :lang="sentence.language">{{ token.form }}</span>
                  <span class="annotation">{{ token.part_of_speech | partOfSpeech }}</span>
                  <span class="annotation">
                    <em :lang="sentence.language">
                      <router-link
                        :to="{ name: 'lemma', params: { gid: buildLemmaGID(dictionaryGID, token) }}">
                      {{ token.lemma }}<span v-if="token.variant">#{{ token.variant }}</span>
                      </router-link>
                    </em>
                  </span>
                </div>
              </template>
            </div>
          </b-tab-item>

          <b-tab-item label="Morphology &amp; punctuation">
            <div class="interlinear">
              <template v-for="token in selectedTokens">
                <div class="intlin">
                  <span class="form"> </span>
                  <span class="annotation"></span>
                </div>

                <div class="intlin" v-if="token.presentation_before">
                  <span class="form" :lang="sentence.language">{{ token.presentation_before }}</span>
                </div>

                <div class="intlin">
                  <span class="form" :lang="sentence.language">{{ token.form }}</span>
                  <span class="annotation">{{ token.part_of_speech | partOfSpeech }}</span>
                  <span class="annotation">
                    <em :lang="sentence.language">
                      <router-link
                        :to="{ name: 'lemma', params: { gid: buildLemmaGID(dictionaryGID, token) }}">
                      {{ token.lemma }}<span v-if="token.variant">#{{ token.variant }}</span>
                      </router-link>
                    </em>
                  </span>
                  <span class="annotation msd">{{ token.morphology | morphology1 }}&nbsp;</span>
                  <span class="annotation msd">{{ token.morphology | morphology2 }}&nbsp;</span>
                </div>

                <div class="intlin" v-if="token.presentation_after">
                  <span class="form" :lang="sentence.language">{{ token.presentation_after }}</span>
                </div>
              </template>
            </div>
          </b-tab-item>

          <b-tab-item label="Syntax">
            <curved-graph :tokens="sentence.tokens"></curved-graph>
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
  </article>
</template>

<style lang="sass">
.interlinear
  clear: both
  text-align: left

  .intlin
    float: left
    text-align: left
    margin-bottom: 1.2em
    padding-left: 0.25em
    padding-right: 0.25em

    .form
      display: block
      font-size: 1.3em
      text-align: center

    .space
      width: 1em

    .annotation
      display: block
      text-align: center
      color: grey

    .msd
      font-size: 0.7em

.interlinear:after
  visibility: hidden
  display: block
  font-size: 0
  content: " "
  clear: both
  height: 0

text
  font-weight: 300
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serf
  font-size: 14px
</style>

<script>
import CurvedGraph from './graphs/CurvedGraph'
import schema from '../data/schema.json'
import MetadataModal from './MetadataModal';
import api from '../api';
import {
  permanentURLs,
  treebankFromGID,
  makeLemmaGID
} from '../shared';

export default {
  components: {
    CurvedGraph,
    MetadataModal,
  },

  data () {
    return {
      sentence: {
        tokens: [],
        source: {},
      },

      language: 'lat',
    }
  },

  props: ['gid'],

  computed: {
    permanentURL() { return permanentURLs.sentence(this.gid); },

    treebank() { return treebankFromGID(this.gid); },

    dictionaryGID() { return [this.treebank.id, this.treebank.version, this.sentence.language].join(':'); },

    allTokens() {
      return this.sentence.tokens
    },

    selectedTokens() {
      return this.visibleTokens
    },

    visibleTokens() {
      return this.sentence.tokens.filter(t => !t.empty_token_sort)
    },

    sentenceID () { return this.gid.split(':')[3]; },

    hasPrevious() { return !!this.sentence.previous_gid; },

    hasNext() { return !!this.sentence.next_gid; },
  },

  mounted() {
    // addSvg()
  },

  created() {
    this.fetchEntries()
  },

  watch: {
    '$route' (to, from) {
      this.fetchEntries()
    },
  },

  methods: {
    buildLemmaGID(dictionaryGID, token) {
      return makeLemmaGID(dictionaryGID, token.lemma, token.part_of_speech, token.variant);
    },

    fetchEntries() {
      return api.getSentence(this.gid).then((response) => {
        this.sentence = response.data || {}
        // this.$nextTick(() => {
        //  this.drawGraph()
        // })
      }).catch(error => {
        api.handleAPIError(error)
        // abort()
      })
    }
  }
}
</script>
