<template>
  <section>
    <article class="notification" v-for="p in expandedParadigm" v-if="hasForms(p)">
      <h3 class="subtitle">{{ p.title }}</h3>

      <table class="table is-bordered">
        <thead>
          <tr>
            <th :width="columnWidth(p.levels1)"></th>
            <th :width="columnWidth(p.levels1)" v-for="l1 in p.levels1">{{ l1.text }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="l2 in p.levels2">
            <th>{{ l2.text }}</th>
            <td v-for="l12 in p.levels1">
              <span v-for="form in getForms(l12.pattern, l2.pattern, p.pattern)">
                <router-link :to="{ name: 'tokens', query: { language: language, form: form.form, partOfSpeech: partOfSpeech, lemma: lemma, morphology: form.morphology, flattened: doCaseFlattening }}" :lang="language">{{ form.form }}</router-link> ({{ form.n }})<br>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </article>

    <div class="notification" v-if="unattestedLevelsAsText !== ''">
      No attestations were found for {{ unattestedLevelsAsText }}
    </div>
  </section>
</template>

<script>
import _ from '../mylodash';
import paradigms from '../data/paradigms.json';

const features = [
  'person',
  'number',
  'tense',
  'mood',
  'voice',
  'gender',
  'case',
  'degree',
  'strength',
  'inflection'
]

export default {
  name: 'Paradigm',

  props: ['lemma', 'language', 'partOfSpeech', 'forms'],

  computed: {
    // Partitions the levels of the paradigm into attested and unattested
    partitionLevels() {
      let attested = []
      let unattested = [];

      for (let p of this.expandedParadigm) {
        if (this.hasForms(p))
          attested.push(p);
        else
          unattested.push(p);
      }

      return [attested, unattested];
    },

    attestedLevels() {
      return this.partitionLevels[0];
    },

    unattestedLevels() {
      return this.partitionLevels[1];
    },

    unattestedLevelsAsText() {
      return this.unattestedLevels.filter(p => p.title).map(p => p.title.toLowerCase()).join(', ').replace(/, ([^,]+)$/, ' or $1')
    },

    doCaseFlattening() {
      //if (this.lemma.length > 0 && this.lemma[0] === this.lemma[0].toLowerCase())
      //  return true;
      //else
      return false;
    },

    paradigms() {
      // FIXME: alias orv to chu; find a way to do this in the data structure instead
      const l = this.language === 'orv' ? 'chu' : this.language
      return paradigms[l] || { parts_of_speech: [], templates: {} }
    },

    paradigm() {
      return this.paradigms.parts_of_speech[this.partOfSpeech] || []
    },

    // Expands templates in the paradigm
    expandedParadigm() {
      return this.paradigm.map(paradigm => {
        const template = this.paradigms.templates[paradigm.template] || {}
        const levels1 = template.levels1 || this.paradigms.axes[template.axis1] || {}
        const levels2 = template.levels2 || this.paradigms.axes[template.axis2] || {}

        return {
          title: paradigm.title,
          pattern: paradigm.pattern,
          levels1: levels1,
          levels2: levels2
        }
      })
    },

    mappedForms() {
      if (this.doCaseFlattening) {
        // Case flattening
        return _.mapValues(this.forms, p => {
          return _.reduce(p, (result, n, form) => {
            let f = form.toLowerCase();
            if (result[f])
              result[f] += n;
            else
              result[f] = n;
            return result;
          }, {});
        });
      } else {
        return this.forms;
      }
    },
  },

  methods: {
    columnWidth(levels) {
      const p = (levels && levels.length > 0) ? 100.0 / levels : 100
      return p + '%'
    },

    mergePatterns(pattern1, pattern2, pattern3) {
      let n = {};
      return Object.assign(n, pattern1 || {}, pattern2 || {}, pattern3 || {});
    },

    makeRegex(pattern) {
      const t = features.map(feature => pattern[feature] || '.').join('');
      return new RegExp('^' + t + '$');
    },

    // Picks out the intersection between the set of forms and the patterns. Orders
    // the results by token frequency.
    getForms(pattern1, pattern2, pattern3) {
      const merged = this.mergePatterns(pattern1, pattern2, pattern3)
      const regex = this.makeRegex(merged)

      let matches = []

      for (let m in this.mappedForms) {
        if (this.mappedForms.hasOwnProperty(m)) {
          if (regex.test(m)) {
            let forms = this.mappedForms[m];
            for (let f in forms) {
              if (forms.hasOwnProperty(f)) {
                matches.push({ form: f, n: forms[f], morphology: m });
              }
            }
          }
        }
      }

      return matches.sort((a, b) => b.n - a.n)
    },

    hasForms(p) {
      for (let l2 of p.levels2) {
        for (let l12 of p.levels1) {
          for (let form of this.getForms(l12.pattern, l2.pattern, p.pattern)) {
            if (form.n > 0)
              return true; // short-circuit
          }
        }
      }

      return false;
    },
  }
}
</script>

<style lang="sass" scoped>
th:first-child, tbody th
  border-right: 2px solid #d3d6db
</style>
