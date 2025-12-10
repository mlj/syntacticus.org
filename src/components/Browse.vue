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
      // Sort keys of sourcesByLanguage based on token count
      return Object.keys(this.sourcesByLanguage).sort((a, b) => {
        return this.languagesSortedByTokenCount[b] - this.languagesSortedByTokenCount[a];
      })
    },

    languagesSortedByTokenCount() {
      const result = {};
      for (const lang in this.sourcesByLanguage) {
        if (Object.prototype.hasOwnProperty.call(this.sourcesByLanguage, lang)) {
          const sources = this.sourcesByLanguage[lang];
          // Sum by token_count
          result[lang] = sources.reduce((sum, source) => sum + (source.token_count || 0), 0);
        }
      }
      return result;
    },

    dictionariesByLanguage() {
      // Group by language
      return this.dictionaries.reduce((acc, obj) => {
        const key = obj.language;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    },

    sourcesByLanguage() {
      // Group by language
      return this.sources.reduce((acc, obj) => {
        const key = obj.language;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
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
