import _ from './mylodash';

// Flattens the case of forms in a paradigm.
export function flattenForms(forms) {
  return _.mapValues(forms, p => {
    return _.reduce(p, (result, n, form) => {
      let f = form.toLowerCase()
      if (result[f])
        result[f] += n
      else
        result[f] = n
      return result
    }, {})
  })
}

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

export function makeRegex(pattern) {
  const t = features.map(feature => pattern[feature] || '.').join('');
  return new RegExp('^' + t + '$');
}

function mergePatterns(pattern1, pattern2, pattern3) {
  let n = {};
  return Object.assign(n, pattern1 || {}, pattern2 || {}, pattern3 || {});
}

// Picks out the intersection between the set of forms and the patterns. Orders
// the results by token frequency.
export function getMappedForms(mappedForms, pattern1, pattern2, pattern3) {
  const merged = mergePatterns(pattern1, pattern2, pattern3)
  const regex = makeRegex(merged)

  let matches = []

  for (let m in mappedForms) {
    if (mappedForms.hasOwnProperty(m)) {
      if (regex.test(m)) {
        let forms = mappedForms[m];
        for (let f in forms) {
          if (forms.hasOwnProperty(f)) {
            matches.push({ form: f, n: forms[f], morphology: m });
          }
        }
      }
    }
  }

  return matches.sort((a, b) => b.n - a.n)
}