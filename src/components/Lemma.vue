<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-2" :lang="language">
            {{ lemma }}<span v-if="variant">#{{ variant }}</span>
          </h1>
          <h2 class="subtitle is-4"> {{ language | language }}</h2>
          <p>
            <strong>{{ partOfSpeech | partOfSpeech }}</strong>

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
              <br>English: {{ glosses.eng }}
            </span>
            <span v-if="glosses.rus" lang="ru">
              <br>Russian: {{ glosses.rus }}
            </span>
          </p>

          <p v-if="hasHomographs">
            See also
            <span v-for="homograph in parsedHomographs">
              <router-link :to="{ name: 'lemma', params: { gid: [dictionaryGID, homograph.lemma, homograph.partOfSpeech].join(':') }}">
                <span :lang="language">{{ homograph.lemma }}</span>
                ({{ homograph.partOfSpeech | partOfSpeech }})
              </router-link>
            </span>
          </p>
        </div>

        <div class="column is-narrow has-text-right">
          <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
          <br>
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
          <br>
          <a class="button is-warning is-small" @click="openModal">Details...</a>
          <modal :visible="showModal" @close="closeModal">
            <p slot="header">
              <strong>{{ lemma }}</strong> ({{ partOfSpeech | partOfSpeech }}, {{ language | language }})
            </p>

            <p>
              This lemma is from the {{ language | language }} dictionary generated from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
            </p>

            <p>
              It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
            </p>

            <p>
              If you want to link to this text you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
            </p>
          </modal>
        </div>
      </div>
    </div><!-- del -->

    <div class="container" v-if="hasParadigm">
      <h3 class="subtitle">Paradigm</h3>

      <p>
        <small>This table shows the distribution of this lemma by inflectional form. Note that the same form may be found in multiple cells if the exact form cannot be determined or the annotator flagged the analysis as uncertain.</small>
      </p>

      <paradigm :lemma="lemma" :partOfSpeech="partOfSpeech" :language="language" :forms="paradigm"></paradigm>
    </div>

    <div class="container" v-if="hasValency">
      <h3 class="subtitle">Valency</h3>

      <p>
        <small>The valency table shows the frequency the lemma grouped by argument structure. The table has been generated from the annotation in the treebank and therefore uses the same classification system for arguments. Click on the frequency numbers to see those occurrences in context.</small>
      </p>

      <valency :valency="valency"></valency>
    </div>

    <div class="container">
      <nav class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <multiselect
            v-model="timelineType"
            :options="['Timeline', 'Table']"
            :multiple="false"
            :show-labels="false"
            :searchable="false"
            :allow-empty="false">
          </multiselect>

          <!-- multiselect
            v-model="timelineVariable"
            :options="['by composition', 'by manuscript']"
            :multiple="false"
            :show-labels="false"
            :searchable="false"
            :allow-empty="false">
          </multiselect -->
        </div>
      </nav>

      <div class="tile is-ancestor" v-if="timelineType === 'Timeline'">
        <div class="tile is-parent">
          <article class="tile is-child">
            <h3 class="subtitle">Chronology by composition</h3>
            <timeline :events="timelineText"></timeline>
          </article>
        </div>

        <div class="tile is-parent">
          <article class="tile is-child">
            <h3 class="subtitle">Chronology by manuscript</h3>
            <timeline :events="timelineMs"></timeline>
          </article>
        </div>
      </div>

      <table class="table is-fullwidth" v-else>
        <thead>
          <tr>
            <td>Text</td>
            <td>Absolute frequency</td>
            <td>Composition year</td>
            <td>Manuscript year</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in distribution">
            <td><tt>{{ d.id }}</tt></td>
            <td>{{ d.n }}</td>
            <td>{{ d.chronology.text }}</td>
            <td>{{ d.chronology.ms }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Modal from './Modal';
import api from '../api';
import Timeline from './Timeline';
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
    Timeline,
    Modal,
    Multiselect,
  },

  data() {
    return {
      distribution: [],
      glosses: {},
      homographs: [],
      paradigm: {},
      valency: [],
      showModal: false,
      timelineType: 'Timeline',
      // timelineVariable: 'by composition',
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

    timelineText() {
      return this.distribution.map(d => {
        let year = d.chronology.text
        return {
          label: year + ': ' + d.id + ' (' + d.n + ')',
          date: year
        }
      })
    },

    timelineMs() {
      return this.distribution.map(d => {
        let year = d.chronology.ms
        return {
          label: year + ': ' + d.id + ' (' + d.n + ')',
          date: year
        }
      })
    },

    frequency() { return this.distribution.map(e => e.n).reduce((a, e) => a + e, 0) },

    hasGlosses() { return this.glosses.eng !== undefined || this.glosses.rus !== undefined; },

    hasValency() { return this.valency && this.valency.length > 0; },

    hasParadigm() {
      return this.paradigm && _.keys(this.paradigm).length > 0 && (this.language === 'lat' || this.language === 'orv' || this.language === 'chu' || this.language === 'got');
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
    openModal () { this.showModal = true; },

    closeModal () { this.showModal = false; },

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
