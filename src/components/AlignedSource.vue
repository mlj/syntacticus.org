<template>
  <article>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title">{{ title }}</h1>
            <h2 class="subtitle" v-if="author">{{ author }}</h2>
            <strong>Parallel view aligned with {{ alignment.title }}</strong>
            (<router-link :to="{ name: 'source', params: { gid: gid }}">switch to non-aligned view</router-link>)
          </div>

          <div class="column is-narrow has-text-right">
            <a :href="treebank.mainURL">{{ treebank.name }}</a> version {{ treebank.version }}
            <br>
            <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license
            <br>
            <a class="button is-warning is-small" @click="openModalBasic">Details...</a>
            <modal :visible="showModal" @close="closeModalBasic">
              <p>
                <strong>{{ title }}</strong> <small>({{ language | language }}, {{ tokenCount }} tokens, {{ sentenceCount }} sentences)</small>
                <br>
                This text is from the <a :href="treebank.mainURL">{{ treebank.name }}</a> version <a :href="treebank.releaseURL">{{ treebank.version }}</a>.
              </p>

              <p>
                It is licensed to you under the <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> license. If you use data from it in academic work, please use the recommended <a :href="treebank.citationURL">citation form</a>.
              </p>

              <p>
                If you want to link to this text you should use the permanent link <a :href="permanentURL">{{ permanentURL }}</a>.
              </p>
              </p>
            </modal>
          </div>
        </div>

        <div class="contents">
          <div v-infinite-scroll="loadChunk" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <span v-for="chunk in loadedChunks">
              <span v-for="sentencePair in chunk">
                <div class="columns">
                  <div class="column is-half">
                    <span v-for="sentence in sentencePair[1]">
                      <router-link :to="{ name: 'sentence', params: { gid: sentence[0] } }">
                        <span :lang="language" v-html="sentence[1]"></span>
                      </router-link>
                    </span>
                  </div>
                  <div class="column is-half">
                    <span v-for="sentence in sentencePair[0]">
                      <router-link :to="{ name: 'sentence', params: { gid: sentence[0] } }">
                        <span :lang="alignment.language" v-html="sentence[1]"></span>
                      </router-link>
                    </span>
                  </div>
                </div>
                </router-link>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </article>

      <!-- 
      <h1 class="title">Table of contents</h2>

      <ul class="index">
        <li class="hbox"><a href="#usage">Matthew</a><span class="spacer"></span><span class="sect">GNT MATT 1.1-28.20</span></li>
          <ul>
            <li class="hbox"><a href="#jsfiles">Chapter 1</a><span class="spacer"></span><span class="sect">GNT MATT 1.1-25</span></li>
            <li class="hbox"><a href="#data-main">Chapter 2</a><span class="spacer"></span><span class="sect">GNT MATT 2.1-23</span></li>
            <li class="hbox"><a href="#define">Chapter 3</a><span class="spacer"></span><span class="sect">GNT MATT 3.1-17</span></li>
          </ul>
        </li>
      </ul>
      -->
</template>

<script>
import Modal from './Modal';
import api from '../api';
import { permanentURLs, treebankFromGID } from '../shared';

export default {
  components: {
    Modal,
  },

  data() {
    return {
      author: null,
      title: null,
      language: null,
      license: null,
      tokenCount: null,
      sentenceCount: null,
      loadedChunks: [],
      alignment: {
        chunks: [],
      },
      busy: false,
      showModal: false,
    }
  },

  props: ['gid'],

  created() {
    this.fetchEntries();
  },

  watch: {
    '$route' (to, from) {
      this.fetchEntries();
    },
  },

  computed: {
    permanentURL() { return permanentURLs.source(this.gid); },

    treebank() { return treebankFromGID(this.gid); },

    chunks() { return this.alignment.chunk_ids; },
  },

  methods: {
    openModalBasic () { this.showModal = true; },

    closeModalBasic () { this.showModal = false; },

    fetchEntries() {
      let page = +this.$route.query.page || 1

      let params = { }

      this.busy = true;

      return api.getSource(this.gid, params).then((response) => {
        this.author = response.data.author;
        this.title = response.data.title;
        this.language = response.data.language;
        this.license = response.data.license;
        this.tokenCount = response.data.token_count;
        this.sentenceCount = response.data.sentence_count;
        this.alignment = response.data.alignment || {};

        return this.loadChunk();        
      }).catch((error) => api.handleError(error))
    },

    loadChunk() {
      if (this.chunks.length > this.loadedChunks.length) {
        this.busy = true;
        let chunkId = this.chunks[this.loadedChunks.length];

        return api.getAlignedChunk(chunkId).then((response) => {
          this.loadedChunks.push(response.data);
          this.busy = false;
        }).catch((error) => api.handleError(error));
      } else {
        this.busy = false;
        return null;
      }
    },
  }
}
</script>

<style lang="scss">
.citation {
  color: blue;
}

//ul.index
//  padding: 0
//  background-color: transparent
//  border: none
//  -moz-box-shadow: none
//  font-style: normal
//  font-family: "Inconsolata", Andale Mono, Monaco, Monospace

//ul ul
//  border: none
//  padding: 0
//  margin: 0 0 0 2em

//.hbox
//  display: -webkit-box
//  -webkit-box-orient: horizontal
//  -webkit-box-align: stretch
//  display: -moz-box
//  -moz-box-orient: horizontal
//  -moz-box-align: stretch
//  display: box
//  box-orient: horizontal
//  box-align: stretch
//  width: 100%

//.hbox > *
//  -webkit-box-flex: 0
//  -moz-box-flex: 0
//  box-flex: 0
//  display: block

//span.spacer
//  color: #2e87dd
// margin: 0 3px 0 5px
//  background-image: url("/static/dot.png")
//  background-repeat: repeat-x
//  background-position: left 13px

//.spacer
//  -webkit-box-flex: 1
//  -moz-box-flex: 1
//  box-flex: 1
</style>
