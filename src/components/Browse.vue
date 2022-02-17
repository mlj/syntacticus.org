<template>
  <article>
    <section class="section">
      <div class="container">
        <div class="columns">
        <div class="column">
        <div class="menu">
          <template v-for="language of sortedLanguages">
            <p class="menu-label">
              {{ language | language }}
            </p>
            <ul class="menu-list">
              <li v-for="source of sourcesByLanguage[language]">
                <p>
                  <router-link :to="{ name: 'source', params: { gid: source.id }}">
                    <template v-if="source.author">{{ source.author }}, </template>
                    <em>{{ source.title }}</em>
                  </router-link>
                </p>
              </li>
              <li>
                <span v-for="dictionary in dictionariesByLanguage[language]">
                  <router-link :to="{ name: 'dictionary', params: { gid: dictionary.id }}">
                    <strong>Dictionary</strong>
                  </router-link>
                </span>
              </li>
            </ul>
          </template>
        </div>
        </div>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
import api from '../api';
import _ from '../mylodash';

export default {
  data() {
    return {
      sources: [],
      dictionaries: [],
    }
  },

  computed: {
    /* Languages sorted by total number of tokens in descending order */
    sortedLanguages() {
      return _.sortBy(_.keys(this.sourcesByLanguage), l => -this.languagesSortedByTokenCount[l])
    },

    languagesSortedByTokenCount() {
      return _.mapValues(this.sourcesByLanguage, sources => _.sumBy(sources, source => source.token_count))
    },

    dictionariesByLanguage() {
      return _.groupBy(this.dictionaries, i => i.language)
    },

    sourcesByLanguage() {
      return _.groupBy(this.sources, i => i.language)
    },
  },

  created() {
    Promise.all([
      api.getSources(),
      api.getDictionaries(),
    ]).then(([response1, response2]) => {
      // TODO: deal with pagination one day or precompute these stats
      this.sources = response1.data.data
      this.dictionaries = response2.data.data
    }).catch((error) => api.handleError(error))
  },
}
</script>
