<template>
<article>
  <section id="overview" class="section">
    <div class="container">
      <h1 class="title is-3">About Syntacticus</h1>

      <div class="columns is-multiline">
        <div class="column is-two-thirds">
          <div class="content">
            <p>
              Syntacticus provides easy access to around a million morphosyntactically annotated sentences from a range of early Indo-European languages.
            </p>

            <p>
              Syntacticus is an umbrella project for the <a href="https://proiel.github.io/">PROIEL Treebank</a>, the <a href="https://torottreebank.github.io/">TOROT Treebank</a> and the <a href="https://iswoc.github.io/">ISWOC Treebank</a>, which all use the same annotation system and share similar linguistic priorities. In total, Syntacticus contains {{ totals.sentenceCount | number }} sentences or {{ totals.tokenCount | number }} tokens in {{ totals.languageCount | number }} languages.
            </p>

            <p>
              We are constantly adding new material to Syntacticus. The ultimate goal is to have a representative sample of different text types from each branch of early Indo-European. We maintain lists of texts we are working on at the moment, which you can find on the <a href="https://proiel.github.io/">PROIEL Treebank</a> and the <a href="https://torottreebank.github.io/">TOROT Treebank</a> pages, but this is extremely time-consuming work so please be patient!
            </p>

            <p>
              The focus for Syntacticus at the moment is to consolidate and edit our documentation so that it is easier to approach. We are very aware that the current documentation is inadequate! But new features and better integration with our development toolchain are also on the horizon in the near future.
            </p>
          </div>
        </div>

        <div class="column is-one-third has-text-centered">
          <div class="content">
            <table class="table is-narrow">
              <thead>
                <tr>
                  <th>Language</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tokenCount, language) in statsByLanguage">
                  <td>{{ language | language }}</td>
                  <td>{{ tokenCount | number }} tokens</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h1 class="subtitle">Annotation principles</h1>

      <div class="columns is-multiline">
        <div class="column">
          <div class="content">
            <p>
              In Syntacticus each text has been split into words, and then each word has been
              <ol>
                <li>lemmatised (i.e. linked to its dictionary entry),</li>
                <li>assigned a part of speech (i.e. classified as noun, verb etc.),</li>
                <li>assigned morphological features (e.g. tagged with its case form or its tense), and</li>
                <li>given a syntactic function and linked to one or more other words (e.g. the subject of a verb has been labelled a subject and linked to the verb).</li>
              </ol>
              This has all been done manually by a language specialist and then verified by another specialist.
            </p>

            <p>
              You can use this information in a number of ways. For example, if you know Latin but need help understanding the structure of a complex sentence, you can look up the specialist's analysis of that sentence.
            </p>

            <p>
              The lemmatisation, parts of speech and morphology broadly speaking follow the same principles as standard reference grammars of Indo-European languages. In some situations we have adopted a different approach, which is more in line with modern formal linguistic thinking. This is the case in particular for various function words (such as subordinators, subjunctions, particles and interjections), which reference grammars tend to disagree on.
            </p>

            <p>
              The syntactic annotation is based on the principles of <a href="https://en.wikipedia.org/wiki/Dependency_grammar">dependency grammar</a>. Each word is assigned a function, called a <em>relation</em>, and then linked to its <em>head</em>. For the English sentence <em>John loves Mary</em>, for example, <em>John</em> would have the relation <em>subject</em> and its head would be the verb <em>loves</em> because it is the subject of that verb. <em>Mary</em> would be <em>object</em> and its head would also be <em>loves</em>.
            </p>

            <p>
              Our version of dependency grammar is heavily influenced by <a href="https://en.wikipedia.org/wiki/Lexical_functional_grammar">Lexical-Functional Grammar</a>. This concerns in particular the granularity of argument and non-argument relations and how to distinguish between them, but we have also imported principles for annotating more complex linguistic structures such as <a href="https://en.wikipedia.org/wiki/Raising_(linguistics)">raising</a> and <a href="https://en.wikipedia.org/wiki/Control_(linguistics)">control</a>.
            </p>

            <p>
              The annotation system is documented in our <a href="https://proiel.github.io/handbook/">handbook</a>. (Note that the present handbook is a compilation of several individual documents, some of which were written quite some time ago. We are in the process of editing and updating these documents, but for now they have to do!)
            </p>

            <p>
            Some of the texts also have <a href="https://en.wikipedia.org/wiki/Information_structure">information-structure</a> annotation. It is not yet possible to browse or query this from <a href="http://syntacticus.org">syntacticus.org</a> but the annotation is available in our raw data releases.
            </p>

            <p>
              The New Testamanent texts in Syntacticus have been aligned with the Ancient Greek original. This means that you can browse them side-by-side and see how each word in a translation relates to the Ancient Greek original. This feature is not fully implemented on <a href="http://syntacticus.org">syntacticus.org</a>, and if you cannot wait for the complete implementation to be ready you should consult our raw data releases.
            </p>
          </div>
        </div>
      </div>

      <h2 class="subtitle">Licensing</h2>

      <div class="columns is-multiline">
        <div class="column">
          <div class="content">
            <p>
              All treebank data and other linguistic resources available from Syntacticus have been made available to you by the copyright holders under a <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0</a> or <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0</a> license. In practice, this means you are free to use the data in a non-commercial setting as long as you provide complete attribution. You may also extract a subset of the data or derive a new data set by processing data from Syntacticus, but you must then make it freely available under the same license.
            </p>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column">
          <div class="content">
            <p>
              If you use this data in academic work, we ask that you cite the publication that the treebank editor has listed on their website. Please see the pages for the <a href="https://proiel.github.io/">PROIEL Treebank</a>, the <a href="https://torottreebank.github.io/">TOROT Treebank</a> and the <a href="https://iswoc.github.io/">ISWOC Treebank</a> for this information.
            </p>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column">
          <div class="content">
            <p>
              You can also link directly to texts, sentences, dictionaries and lemmas. To do this, click on the yellow <em>Details</em> button and copy the permanent link to the page. This link includes information about the version of the data that you have accessed.
            </p>

            <p>
              The linguistic data you find here is the product of many people's work. Some of it has been supported by funding bodies, other parts are the product of volunteer efforts by specialists. You can find detailed information about contributors and copyright holders for each linguistic resource by clicking on the yellow <em>Details</em> button on text and dictionary pages. This also explains the provenance of electronic text that the resource builds on and any restrictions associated with it.
            </p>
          </div>
        </div>
      </div>

      <h2 class="subtitle">Raw data and developer resources</h2>

      <div class="columns is-multiline">
        <div class="column">
          <div class="content">
            <p>
              Raw data can be downloaded from the pages of the constituent treebanks. We also provide a toolchain and libraries for reading and manipulate raw treebank data. Some of this is documented in our <a href="https://proiel.github.io/handbook/">handbook</a>, and the code is found in out GitHub repositories
              <a href="https://github.com/proiel">https://github.com/proiel</a> and
              <a href="https://github.com/mlj">https://github.com/mlj</a>.
            </p>
          </div>
        </div>
      </div>

      <h2 class="subtitle">Learn more!</h2>

      <div class="columns is-multiline">
        <div class="column">
          <div class="content">
            <p>
              The definitive reference manual for Syntacticus is our <a href="https://proiel.github.io/handbook/">handbook</a>. If you have questions you can talk to us on <a href="https://gitter.im/proiel/syntacticus">Gitter</a> and we will try to reply as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</article>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      sources: [],
    }
  },

  computed: {
    totals() {
      let s = {
        languageCount: 0,
        sentenceCount: 0,
        tokenCount: 0,
      }

      let languages = {};

      for (let t of this.sources) {
        languages[t.language] = true
        s.tokenCount += t.token_count
        s.sentenceCount += t.sentence_count
      }

      for (let k in languages) {
        if (k in languages) {
          s.languageCount += 1
        }
      }

      return s
    },

    statsByLanguage() {
      let s = {}

      for (let t of this.sources) {
        if (!(t.language in s))
          s[t.language] = 0

        s[t.language] += t.token_count
      }

      return s
    }
  },

  created() {
    api.getSources().then((response) => {
      // TODO: deal with pagination one day or precompute these stats
      this.sources = response.data.data;
    }).catch((error) => api.handleError(error))
  },
}
</script>
