import schema from './data/schema.json';
import { formatNumber } from 'accounting';
import { languages } from './shared';

export function numberFilter(v) {
  return formatNumber(v);
}

export function languageFilter(v) {
  return languages[v] || 'Unknown language';
}

export function capitalizeFilter(v) {
  if (!v) return '';
  v = v.toString();
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function partOfSpeechFilter(v) {
  return schema.part_of_speech[v] || '';
}

export function morphology1Filter(f) {
  let [p, n, /* t */, /* m */, /* v */, g, c, /* d */, /* s */, /* i */] = f.split('');
  return [schema.person[p], schema.case[c], schema.number[n], schema.gender[g]].filter(Boolean).join(' ');
}

export function morphology2Filter(f) {
  let [/* p */, /* n */, t, m, v, /* g /*, /* c */, d, s, /* i */] = f.split('');
  return [schema.tense[t], schema.mood[m], schema.voice[v], schema.degree[d], schema.strength[s]].filter(Boolean).join(' ');
}

export default {
  install(Vue) {
    Vue.filter('number', numberFilter);
    Vue.filter('language', languageFilter);
    Vue.filter('capitalize', capitalizeFilter);
    Vue.filter('partOfSpeech', partOfSpeechFilter);
    Vue.filter('morphology1', morphology1Filter);
    Vue.filter('morphology2', morphology2Filter);
  }
}
