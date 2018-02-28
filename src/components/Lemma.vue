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
                  {{ language | language }}, {{ partOfSpeech | partOfSpeech }}
                </small>

                <small v-if="frequency > 1">
                  (occurs {{ frequency }} times in the corpus)
                </small>
                <small v-else-if="frequency == 1">
                  (occurs once in the corpus)
                </small>
                <small v-else>
                  (does not occur in the corpus)
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
                <span class="icon"><i class="fa fa-plus-square"></i></span> See also
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
          <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
          <br>
          <span class="icon"><i class="fa fa-creative-commons"></i></span>
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
          <br>
          <metadata-modal>
            <p slot="header">
              <strong>{{ lemma }}</strong> ({{ partOfSpeech | partOfSpeech }}, {{ language | language }})
            </p>

            <p>
              This lemma is from the {{ language | language }} dictionary generated from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
            </p>

            <p>
              It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
            </p>

            <!-- p>
              If you want to link to this text you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
            </p -->
          </metadata-modal>
        </div>
      </div>
    </div>

    <b-tabs position="is-centered">
      <b-tab-item label="Paradigm" v-if="hasParadigm">
        <div class="notification">
          <small>The tables show the distribution of this lemma by inflectional form. Note that the same form may be found in multiple cells if the exact form cannot be determined or the annotator flagged the analysis as uncertain.</small>
        </div>

        <paradigm :lemma="lemma" :partOfSpeech="partOfSpeech" :language="language" :forms="paradigm"></paradigm>
      </b-tab-item>

      <b-tab-item label="Valency" v-if="hasValency">
        <div class="notification">
          <small>The valency table shows the frequency the lemma grouped by argument structure. The table has been generated from the annotation in the treebank and therefore uses the same classification system for arguments. Click on the frequency numbers to see those occurrences in context.</small>
        </div>

        <valency :valency="valency"></valency>
      </b-tab-item>

      <b-tab-item label="Chronology">
        <div class="notification">
          <small>This shows the chronological distribution of attestations of the lemma in the treebank.</small>
        </div>

        <div class="container">
          <div class="tile is-ancestor">
            <div class="tile is-parent">
              <table class="table is-child">
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
                    <td>{{ yearToText(d.chronology.text) }}</td>
                    <td>{{ yearToText(d.chronology.ms) }}</td>
                    <td>{{ d.n }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- div class="tile is-parent">
              <article class="tile is-child">
                <h3 class="subtitle">By composition</h3>
                <vertical-timeline :events="timelineText"></chart-timeline>
              </article>
            </div>

            <div class="tile is-parent">
              <article class="tile is-child">
                <h3 class="subtitle">By manuscript</h3>
                <vertical-timeline :events="timelineMs"></vertical-timeline>
              </article>
            </div -->

            <div class="tile is-parent is-vertical">
              <article class="tile is-child" v-if="hasTimelineComposition">
                <h3 class="subtitle">Absolute frequency by composition</h3>
                <chart-timeline :events="chartTimelineComposition"></chart-timeline>
              </article>

              <article class="tile is-child" v-if="hasTimelineManuscript">
                <h3 class="subtitle">Absolute frequency by manuscript</h3>
                <chart-timeline :events="chartTimelineManuscript"></chart-timeline>
              </article>
            </div>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import MetadataModal from './MetadataModal';
import api from '../api';
//import VerticalTimeline from './timelines/VerticalTimeline';
import ChartTimeline from './timelines/ChartTimeline';
import Paradigm from './Paradigm';
import Valency from './Valency';
import schema from '../data/schema.json';
import _ from '../mylodash';
import { permanentURLs, treebankFromGID, splitLemmaGID } from '../shared';

export default {
  name: 'Lemma',

  components: {
    Paradigm,
    Valency,
    //VerticalTimeline,
    ChartTimeline,
    MetadataModal,
    Multiselect,
  },

  data() {
    return {
      distribution: [],
      glosses: {},
      homographs: [],
      paradigm: {},
      valency: [],
    }
  },

  props: ['gid'],

  computed: {
    permanentURL() { return permanentURLs.lemma(this.gid); },

    splitGID() { return splitLemmaGID(this.gid); },

    dictionaryGID() { return this.splitGID.dictionaryGID; },

    treebank() { return treebankFromGID(this.gid); },

    language() { return this.splitGID.language; },

    lemma() { return this.splitGID.lemma; },

    variant() { return this.splitGID.variant; },

    partOfSpeech() { return this.splitGID.partOfSpeech; },

    hasHomographs() { return this.homographs.length > 0; },

    // FIXME: do this server side?
    parsedHomographs() {
      return this.homographs.map(h => {
        return { lemma: h.split(',')[0], partOfSpeech: h.split(',')[1] }
      })
    },

    hasTimelineComposition() {
      return _.some(this.distribution, d => (d.chronology.text !== undefined && d.chronology.text !== null));
    },

    hasTimelineManuscript() {
      return _.some(this.distribution, d => (d.chronology.ms !== undefined && d.chronology.ms !== null));
    },

    chartTimelineComposition() {
      return this.distribution.map(d => {
        return {
          id: d.id,
          n: d.n,
          year: d.chronology.text,
        }
      })
    },

    chartTimelineManuscript() {
      return this.distribution.map(d => {
        return {
          id: d.id,
          n: d.n,
          year: d.chronology.ms,
        }
      })
    },

    //timelineText() {
    //  return this.distribution.map(d => {
    //    let year = d.chronology.text
    //    return {
    //      label: year + ': ' + d.id + ' (' + d.n + ')',
    //      date: year
    //    }
    //  })
    //},

    //timelineMs() {
    //  return this.distribution.map(d => {
    //    let year = d.chronology.ms
    //    return {
    //      label: year + ': ' + d.id + ' (' + d.n + ')',
    //      date: year
    //    }
    //  })
    //},

    frequency() { return this.distribution.map(e => e.n).reduce((a, e) => a + e, 0) },

    hasGlosses() { return this.glosses.eng !== undefined || this.glosses.rus !== undefined; },

    hasValency() { return !!(this.valency && this.valency.length > 0); },

    hasParadigm() {
      return this.paradigm && _.keys(this.paradigm).length > 0 && (this.language === 'lat' || this.language === 'orv' || this.language === 'chu' || this.language === 'got' || this.language == 'grc');
    },
  },

  created() {
    this.fetchEntries();
  },

  watch: {
    '$route'(to, from) {
      this.fetchEntries();
    },
  },

  methods: {
    yearToText(v) {
      return v ? (v < 0 ? `${-v} BC` : v) : '';
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
        api.handleError(error);
      })
    },
  },
}
</script>
