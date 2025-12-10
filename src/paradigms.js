// Flattens the case of forms in a paradigm.
export function flattenForms(forms) {
  const result = {};
  for (const key in forms) {
    if (Object.prototype.hasOwnProperty.call(forms, key)) {
      const p = forms[key];
      result[key] = Object.entries(p).reduce((acc, [form, n]) => {
        let f = form.toLowerCase();
        if (acc[f]) acc[f] += n;
        else acc[f] = n;
        return acc;
      }, {});
    }
  }
  return result;
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

// Returns the total number of occurrences of a lemma from a lemma distribution.
export function totalDistributionFrequency(lemmaDistribution) {
  if (!lemmaDistribution) return 0;
  return lemmaDistribution.reduce((a, e) => a + e.n, 0)
}

export function hasSomeCompositionDate(lemmaDistribution) {
  if (!lemmaDistribution) return false;
  return lemmaDistribution.some(d => (d.chronology.t !== undefined && d.chronology.t !== null));
}

export function hasSomeManuscriptDate(lemmaDistribution) {
  if (!lemmaDistribution) return false;
  return lemmaDistribution.some(d => (d.chronology.m !== undefined && d.chronology.m !== null))
}
