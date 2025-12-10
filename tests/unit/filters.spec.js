import {
  languageFilter,
  partOfSpeechFilter,
  morphology1Filter,
  morphology2Filter
} from '@/filters'

describe('filters.js', () => {
  describe('languageFilter', () => {
    it('returns language name for known code', () => {
      expect(languageFilter('lat')).toBe('Latin')
    })

    it('returns Unknown language for unknown code', () => {
      expect(languageFilter('unknown')).toBe('Unknown language')
    })
  })

  describe('partOfSpeechFilter', () => {
    it('returns POS label', () => {
      expect(partOfSpeechFilter('N-')).toBe('infinitive marker')
    })
  })

  describe('morphology1Filter', () => {
    // p, n, t, m, v, g, c, d, s, i
    // Returns: person, case, number, gender

    it('formats morphology string 1', () => {
      // 1st sing, nom, masc
      // p=1, n=s, t=-, m=-, v=-, g=m, c=n, ...
      const morph = '1s---mn---'
      // 1: 1st, s: singular, m: masculine, n: nominative
      // expected order: person, case, number, gender
      // person[1]=1st, case[n]=nominative, number[s]=singular, gender[m]=masculine
      // joined by space
      expect(morphology1Filter(morph)).toBe('first person nominative singular masculine')
    })

    it('skips empty fields (compact)', () => {
      // -s---mn--- (no person)
      const morph = '-s---mn---'
      expect(morphology1Filter(morph)).toBe('nominative singular masculine')
    })
  })

  describe('morphology2Filter', () => {
    // p, n, t, m, v, g, c, d, s, i
    // Returns: tense, mood, voice, degree, strength

    it('formats morphology string 2', () => {
      // pres ind act
      // t=p, m=i, v=a
      const morph = '--pia-----'
      expect(morphology2Filter(morph)).toBe('present indicative active')
    })
  })
})
