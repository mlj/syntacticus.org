<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2" :lang="language">
            {{ lemma }}<span v-if="variant">#{{ variant }}</span>
          </h1>
          <article class="media">
            <div class="media-content">
              <p>
                <strong :lang="language">{{ lemma }}</strong>

                <small>
                  {{ language | language }}, {{ partOfSpeech | partOfSpeech }},
                </small>

                <small v-if="frequency > 1">
                  occurs {{ frequency }} times in the corpus
                </small>
                <small v-else-if="frequency == 1">
                  occurs once in the corpus
                </small>
                <small v-else>
                  does not occur in the corpus
                </small>
              </p>

              <p v-if="hasGlosses">
                <span v-if="glosses.eng" lang="en">
                  English: {{ glosses.eng }}<br>
                </span>
                <span v-if="glosses.rus" lang="ru">
                  Russian: {{ glosses.rus }}<br>
                </span>
              </p>

              <p v-if="hasHomographs">
                See also
                <span v-for="(homograph, i) in parsedHomographs">
                  <router-link :to="{ name: 'lemma', params: { gid: [dictionaryGID, homograph.lemma, homograph.partOfSpeech].join(':') }}">
                    <span :lang="language">{{ homograph.lemma }}</span>
                    ({{ homograph.partOfSpeech | partOfSpeech }})</router-link><span v-if="i + 2 < parsedHomographs.length">, </span><span v-if="i + 2 === parsedHomographs.length"> and </span>
                </span>
              </p>
            </div>
          </article>
        </div>

        <div class="column is-narrow has-text-right">
          <metadata-card :treebank="treebank" />
          <metadata-modal>
            <template v-slot:header>
              <strong>{{ lemma }}</strong> ({{ partOfSpeech | partOfSpeech }}, {{ language | language }})
            </template>

            <p>
              This lemma is from the {{ language | language }} dictionary generated from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
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
    </div>

    <div class="tabs is-centered is-boxed">
      <ul>
        <li :class="{ 'is-active': activeTab === 'paradigm' }" v-if="hasParadigm">
          <a @click.prevent="activeTab = 'paradigm'">Paradigm</a>
        </li>
        <li :class="{ 'is-active': activeTab === 'valency' }" v-if="hasValency">
          <a @click.prevent="activeTab = 'valency'">Valency</a>
        </li>
        <li :class="{ 'is-active': activeTab === 'chronology' }">
          <a @click.prevent="activeTab = 'chronology'">Chronology</a>
        </li>
      </ul>
    </div>

    <div>
      <div v-if="activeTab === 'paradigm' && hasParadigm">
        <div class="notification">
          <small>The tables show the distribution of this lemma by inflectional form. Note that the same form may be found in multiple cells if the exact form cannot be determined or the annotator flagged the analysis as uncertain.</small>
        </div>

        <paradigm :lemma="lemma" :partOfSpeech="partOfSpeech" :language="language" :forms="paradigm"></paradigm>
      </div>

      <div v-if="activeTab === 'valency' && hasValency">
        <div class="notification">
          <small>The valency table shows the frequency the lemma grouped by argument structure. The table has been generated from the annotation in the treebank and therefore uses the same classification system for arguments. Click on the frequency numbers to see those occurrences in context.</small>
        </div>

        <valency :valency="valency"></valency>
      </div>

      <div v-if="activeTab === 'chronology'">
        <div class="notification">
          <small>This shows the chronological distribution of attestations of the lemma in the treebank.</small>
        </div>

        <div class="container">
          <div class="tile is-ancestor">
            <div class="tile is-parent">
              <div class="tile is-child">
                <div class="table-container">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Text</th>
                        <th>Composition year</th>
                        <th>Manuscript year</th>
                        <th>Absolute frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="d in distribution">
                        <td><tt>{{ d.id }}</tt></td>
                        <td>{{ yearToText(d.chronology.t) }}</td>
                        <td>{{ yearToText(d.chronology.m) }}</td>
                        <td>{{ d.n }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="tile is-vertical">
              <div class="tile">
                <div class="tile is-parent">
                  <article class="tile is-child" style="overflow-x: auto">
                    <h3 class="subtitle">By composition</h3>
                    <vertical-timeline :events="timelineText"></vertical-timeline>
                  </article>
                </div>
                <div class="tile is-parent">
                  <article class="tile is-child" style="overflow-x: auto">
                    <h3 class="subtitle">By manuscript</h3>
                    <vertical-timeline :events="timelineMs"></vertical-timeline>
                  </article>
                </div>
              </div>

              <div class="tile is-parent" v-if="hasTimelineComposition">
                <article class="tile is-child" style="overflow-x: auto">
                  <h3 class="subtitle">Absolute frequency by composition</h3>
                  <chart-timeline :events="chartTimelineComposition"></chart-timeline>
                </article>
              </div>

              <div class="tile is-parent" v-if="hasTimelineManuscript">
                <article class="tile is-child" style="overflow-x: auto">
                  <h3 class="subtitle">Absolute frequency by manuscript</h3>
                  <chart-timeline :events="chartTimelineManuscript"></chart-timeline>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MetadataCard from './MetadataCard.vue'
import MetadataModal from './MetadataModal.vue'
import api from '../api'
import VerticalTimeline from './timelines/VerticalTimeline.vue'
import ChartTimeline from './timelines/ChartTimeline.vue'
import Paradigm from './Paradigm.vue'
import Valency from './Valency.vue'
import { permanentURLs, treebankFromGID, splitLemmaGID } from '../shared'
import { totalDistributionFrequency, hasSomeCompositionDate, hasSomeManuscriptDate } from '@/paradigms'

export default {
  name: 'Lemma',

  components: {
    Paradigm,
    Valency,
    VerticalTimeline,
    ChartTimeline,
    MetadataCard,
    MetadataModal,
  },

  data() {
    return {
      activeTab: 'paradigm',
      distribution: [],
      glosses: {},
      homographs: [],
      paradigm: {},
      valency: [],
    }
  },

  props: ['gid'],

  computed: {
    permanentURL() { return permanentURLs.lemma(this.gid) },

    splitGID() { return splitLemmaGID(this.gid) },

    dictionaryGID() { return this.splitGID.dictionaryGID },

    treebank() { return treebankFromGID(this.gid) },

    language() { return this.splitGID.language },

    lemma() { return this.splitGID.lemma },

    variant() { return this.splitGID.variant },

    partOfSpeech() { return this.splitGID.partOfSpeech },

    hasHomographs() { return this.homographs.length > 0 },

    // FIXME: do this server side?
    parsedHomographs() {
      return this.homographs.map(h => {
        return { lemma: h[0], partOfSpeech: h[1] }
      })
    },

    hasTimelineComposition() {
      return hasSomeCompositionDate(this.distribution)
    },

    hasTimelineManuscript() {
      return hasSomeManuscriptDate(this.distribution)
    },

    chartTimelineComposition() {
      return this.distribution.map(d => {
        return {
          id: d.id,
          n: d.n,
          year: d.chronology.t,
        }
      }).filter(d => d.year !== undefined && d.year !== null)
    },

    chartTimelineManuscript() {
      return this.distribution.map(d => {
        return {
          id: d.id,
          n: d.n,
          year: d.chronology.m,
        }
      }).filter(d => d.year !== undefined && d.year !== null)
    },

    timelineText() {
      return this.distribution.map(d => {
        let year = d.chronology.t
        return {
          label: year + ': ' + d.id + ' (' + d.n + ')',
          date: year
        }
      }).filter(d => d.date !== undefined && d.date !== null)
    },

    timelineMs() {
      return this.distribution.map(d => {
        let year = d.chronology.m
        return {
          label: year + ': ' + d.id + ' (' + d.n + ')',
          date: year
        }
      }).filter(d => d.date !== undefined && d.date !== null)
    },

    frequency() {
      return totalDistributionFrequency(this.distribution)
    },

    hasGlosses() { return this.glosses.eng !== undefined || this.glosses.rus !== undefined },

    hasValency() { return !!(this.valency && this.valency.length > 0) },

    hasParadigm() {
      return this.paradigm && Object.keys(this.paradigm).length > 0 && (this.language === 'lat' || this.language === 'orv' || this.language === 'chu' || this.language === 'got' || this.language == 'grc')
    },
  },

  created() {
    this.fetchEntries()
  },

  watch: {
    $route(to, from) {
      this.fetchEntries()
    },
  },

  methods: {
    yearToText(v) {
      return v ? (v < 0 ? `${-v} BC` : v) : ''
    },

    fetchEntries() {
      return api.getLemma(this.splitGID.dictionaryGID, this.lemma, this.partOfSpeech, this.variant).then((response) => {
        // FIXME: verify that language, lemma, pos are identical
        this.distribution = response.data.distribution || []
        this.glosses = response.data.glosses || {}
        this.homographs = response.data.homographs || []
        this.paradigm = response.data.paradigm || {}
        this.valency = response.data.valency || []
      }).catch((error) => {
        api.handleError(error)
      })
    },
  },
}
</script>
