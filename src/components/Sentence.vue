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
              (<router-link v-if="sentence.previous_gid" :to="{ name: 'sentence', params: { gid: sentence.previous_gid }}">Previous sentence</router-link>
              |
              <router-link v-if="sentence.next_gid" :to="{ name: 'sentence', params: { gid: sentence.next_gid }}">Next sentence</router-link>)
            </p>
          </div>

          <div class="column is-narrow has-text-right">
            {{ sentence.citation }}
            <br>
            <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
            <br>
            <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
            <br>
            <a class="button is-warning is-small" @click="openModalBasic">Details...</a>
            <modal :visible="showModal" @close="closeModalBasic">
              <p>
                <strong>{{ sentence.source.title }}</strong> <small>({{ sentence.language | language }})</small>
                <br>
                This sentence is from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
              </p>

              <p>
                It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
              </p>

              <p>
                If you want to link to this sentence you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
              </p>
              </p>
            </modal>
          </div>
        </div>

        <div class="tabs is-centered">
          <ul>
            <li :class="{ 'is-active': showInterlinear && !showPunctuation }"><a @click.prevent="switchToSimpleInterlinear">Lemmas &amp; parts of speech</a></li>
            <li :class="{ 'is-active': showInterlinear && showPunctuation }"><a @click.prevent="switchToDetailedInterlinear">Morphology &amp; punctuation</a></li>
            <li :class="{ 'is-active': showGraph }"><a @click.prevent="switchToGraph">Syntax</a></li>
          </ul>
        </div>

        <!-- div class="columns">
          <div class="column is-narrow">
            <nav class="panel">
              <p class="panel-tabs">
                <a @click.prevent="switchToInterlinear" :class="{ 'is-active': showInterlinear }">Text</a>
                <a @click.prevent="switchToGraph" :class="{ 'is-active': showGraph }">Graph</a>
              </p>
              <span class="panel-block">
                <switches v-model="showPartsOfSpeech"></switches>
                &nbsp;Parts of speech
              </span>
              <span class="panel-block">
                <switches v-model="showLemmas"></switches>
                &nbsp;Lemmas
              </span>
              <span class="panel-block">
                <switches v-model="showMorphology"></switches>
                &nbsp;Morphology
              </span>
              <span class="panel-block">
                <switches v-model="showPunctuation"></switches>
                &nbsp;Punctuation
              </span>
            </nav>
          </div>

          <div class="column" -->
            <div class="graph" v-if="showGraph">
              <curved-graph :tokens="sentence.tokens"></curved-graph>
              <!-- object :data="svgURL" type="image/svg+xml"></object -->
            </div>

            <div class="interlinear" v-if="showInterlinear">
              <template v-for="token in selectedTokens">
                <div class="intlin">
                  <span class="form"> </span>
                  <span class="annotation"></span>
                </div>

                <div class="intlin" v-if="showPunctuation && token.presentation_before">
                  <span class="form" :lang="sentence.language">{{ token.presentation_before }}</span>
                </div>

                <div class="intlin">
                  <span class="form" :lang="sentence.language">{{ token.form }}</span>
                  <span class="annotation" v-if="showPartsOfSpeech">{{ token.part_of_speech | partOfSpeech }}</span>
                  <span class="annotation" v-if="showLemmas">
                    <em :lang="sentence.language">
                      <router-link
                        :to="{ name: 'lemma', params: { gid: [dictionaryGID, token.lemma, token.part_of_speech].join(':') }}">
                      {{ token.lemma }}
                      </router-link>
                    </em>
                  </span>
                  <span class="annotation msd" v-if="showMorphology">{{ token.morphology | morphology1 }}&nbsp;</span>
                  <span class="annotation msd" v-if="showMorphology">{{ token.morphology | morphology2 }}&nbsp;</span>
                </div>

                <div class="intlin" v-if="showPunctuation && token.presentation_after">
                  <span class="form" :lang="sentence.language">{{ token.presentation_after }}</span>
                </div>
              </template>
            <!-- /div>
          </div -->
        </div>
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
import Switches from './Switches';
import CurvedGraph from './graphs/CurvedGraph'
import schema from '../data/schema.json'
import Modal from './Modal';
import api from '../api';
import { permanentURLs, treebankFromGID } from '../shared';

export default {
  components: {
    CurvedGraph,
    Switches,
    Modal,
  },

  data () {
    return {
      showPunctuation: false,
      showPartsOfSpeech: true,
      showLemmas: true,
      showMorphology: false,

      showInterlinear: true,
      showGraph: false,

      sentence: {
        tokens: [],
        source: {},
      },

      language: 'lat',

      showModal: false,
    }
  },

  props: ['gid'],

  computed: {
    permanentURL() { return permanentURLs.sentence(this.gid); },

    treebank() { return treebankFromGID(this.gid); },

    dictionaryGID() { return [this.treebank.id, this.treebank.version, this.sentence.language].join(':'); },

    // svgURL() {
    //   return this.$http.options.root + '/graphs/' + this.$route.params.sentence
    // },

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
    switchToGraph() {
      this.showInterlinear = false;
      this.showGraph = true;
    },

    switchToInterlinear() {
      this.showInterlinear = true;
      this.showGraph = false;
    },

    switchToSimpleInterlinear() {
      this.showMorphology = false;      
      this.showPunctuation = false;
      this.showLemmas = true;
      this.showPartsOfSpeech = true;
      this.switchToInterlinear();
    },

    switchToDetailedInterlinear() {
      this.showMorphology = true;      
      this.showPunctuation = true;
      this.showLemmas = true;
      this.showPartsOfSpeech = true;
      this.switchToInterlinear();
    },

    openModalBasic() { this.showModal = true; },

    closeModalBasic() { this.showModal = false; },

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
