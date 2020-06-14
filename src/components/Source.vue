<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title">{{ title }}</h1>
          <h2 class="subtitle" v-if="author">{{ author }}</h2>
          <span v-if="isAligned">
            <strong>Non-aligned view</strong>
            (<router-link :to="{ name: 'aligned_source', params: { gid: gid }}">switch to parallel view aligned with {{ alignment.title }}</router-link>)
          </span>
        </div>

        <div class="column is-narrow has-text-right">
          <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
          <br>
          <span class="icon"><i class="fa fa-creative-commons"></i></span>
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
          <br>
          <metadata-modal>
            <p slot="header">
              <strong>{{ title }}</strong> <small>({{ language | language }}, {{ tokenCount }} tokens, {{ sentenceCount }} sentences)</small>
            </p>

            <p>
              This text is from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
            </p>

            <p>
              It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
            </p>

            <p>
              If you want to link to this text you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
            </p>

            <p v-if="metadata">
              This annotated text is based on an electronic text originally
              from the Perseus project (with minor modifications). See the
              text's <a :href="metadata.catalogueURL">catalogue entry</a> for
              editorial details or <a :href="metadata.readerURL">browse</a>
              the Perseus project's current version.
            </p>
          </metadata-modal>
        </div>
      </div>

      <div class="contents">
        <div v-infinite-scroll="loadChunk" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <span v-for="chunk in loadedChunks">
            <span v-for="sentence in chunk">
              <router-link :to="{ name: 'sentence', params: { gid: makeSentenceLink(sentence[0]) } }">
                <span :lang="language" v-html="sentence[1]"></span>
              </router-link>
            </span>
          </span>
        </div>
      </div>

      <div v-if="busy" class="notification">
        <i class="fa fa-spinner fa-spin"></i>
        Loading more...
      </div>
    </div>
  </section>
</template>

<script>
import MetadataModal from './MetadataModal';
import api from '../api';
import { eText, permanentURLs, treebankFromGID } from '../shared';

export default {
  components: {
    MetadataModal,
  },

  data() {
    return {
      author: null,
      title: null,
      language: null,
      license: null,
      tokenCount: null,
      sentenceCount: null,
      chunks: [],
      loadedChunks: [],
      alignment: {},
      busy: false,
    }
  },

  props: ['gid'],

  computed: {
    permanentURL() { return permanentURLs.source(this.gid); },

    treebank() { return treebankFromGID(this.gid); },

    metadata() { return eText(this.gid); },

    isAligned() { return this.alignment.gid != null; },
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
    makeSentenceLink(id_part) {
      return `${this.gid}:${id_part}`;
    },

    fetchEntries() {
      this.busy = true;

      return api.getSource(this.gid).then((response) => {
        this.author = response.data.author;
        this.title = response.data.title;
        this.language = response.data.language;
        this.license = response.data.license;
        this.tokenCount = response.data.token_count;
        this.sentenceCount = response.data.sentence_count;
        this.chunks = response.data.chunks;
        this.alignment = response.data.alignment || {};

        this.loadChunk();
      }).catch((error) => {
        api.handleError(error);
        this.busy = false;
      });
    },

    loadChunk() {
      if (this.chunks.length > this.loadedChunks.length) {
        this.busy = true;
        let chunkId = this.chunks[this.loadedChunks.length];

        return api.getChunk(chunkId).then((response) => {
          this.loadedChunks.push(response.data);
          this.busy = false;
        }).catch((error) => {
          api.handleError(error)
          this.busy = false;
        });
      } else {
        this.busy = false;
      }
    },
  }
}
</script>

<style lang="scss">
.citation {
  font-weight: bold;
  font-family: "Inconsolata", Andale Mono, Monaco, Monospace;
  color: black;
}
</style>
