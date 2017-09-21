<template>
  <section class="section">
    <div class="notification is-danger">
      This function has not been implemented yet. This page is only a placeholder.
    </div>

    <h1 class="subtitle is-3">Advanced search</h1>

    <div class="container">
      <label class="label">Language</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.language">
            <option value=""></option>
            <template v-for="language in dictionaries">
              <option :value="language.id">{{ language.name }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Text</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.source">
            <option value=""></option>
            <template v-for="source in sources">
              <option :value="source.id">{{ source.title }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Form</label>
      <p class="control">
        <input class="input" type="text" v-model="query.form">
      </p>

      <label class="label">Lemma</label>
      <p class="control">
        <input class="input" type="text" v-model="query.lemma">
      </p>

      <h4 class="subtitle is-7">Morphology</h4>

      <label class="label">Part of speech</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.part_of_speech">
            <option value=""></option>
            <template v-for="(value, key) in schema.part_of_speech">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>
      
      <label class="label">Inflecting</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.inflection">
            <option value=""></option>
            <template v-for="(value, key) in schema.inflection">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Tense</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.tense">
            <option value=""></option>
            <template v-for="(value, key) in schema.tense">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Mood</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.mood">
            <option value=""></option>
            <template v-for="(value, key) in schema.mood">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Voice</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.voice">
            <option value=""></option>
            <template v-for="(value, key) in schema.voice">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Person</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.person">
            <option value=""></option>
            <template v-for="(value, key) in schema.person">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Case</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.case">
            <option value=""></option>
            <template v-for="(value, key) in schema.case">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Number</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.number">
            <option value=""></option>
            <template v-for="(value, key) in schema.number">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Gender</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.gender">
            <option value=""></option>
            <template v-for="(value, key) in schema.gender">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Degree</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.degree">
            <option value=""></option>
            <template v-for="(value, key) in schema.degree">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Strength</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.strength">
            <option value=""></option>
            <template v-for="(value, key) in schema.strength">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <h4 class="subtitle is-7">Syntax and information structure</h4>

      <label class="label">Dependency relation</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.relation">
            <option value=""></option>
            <template v-for="(value, key) in schema.relation">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <label class="label">Information status</label>
      <p class="control">
        <span class="select is-fullwidth">
          <select v-model="query.information_status">
            <option value=""></option>
            <template v-for="(value, key) in schema.information_status">
              <option v-bind:value="key">{{ value }}</option>
            </template>
          </select>
        </span>
      </p>

      <button v-on:click.prevent="runQuery" type="submit" class="is-primary button">Search</button>
    </div>
  </section>
</template>

<script>
import schema from '../data/schema.json'

export default {
  data () {
    return {
      query: {
        language: null,
        source: null,
        form: null,
        lemma: null,
        part_of_speech: null,
        inflecting: null,
        tense: null,
        mood: null,
        voice: null,
        case: null,
        number: null,
        gender: null,
        degree: null,
        person: null,
        strength: null,
        relation: null,
        information_status: null
      }
    }
  },

  methods: {
    runQuery() {
      this.$router.push({
        name: 'tokens',
        query: this.query
      })
    }
  },

  computed: {
    dictionaries() {
      return this.$store.state.dictionaries
    },

    sources() {
      return this.$store.state.sources
    },

    schema() {
      return schema
    }
  }
}
</script>
