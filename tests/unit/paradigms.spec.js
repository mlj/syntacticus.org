import { flattenForms, makeRegex, getMappedForms, totalDistributionFrequency, hasSomeCompositionDate, hasSomeManuscriptDate } from '@/paradigms'

describe('flattenForms', () => {
  it('flattens forms', () => {
    expect(flattenForms({
      "-s---ma--i": { "senatum": 22, "Senatum": 2 },
      "-s---mb--i": { "senatu": 48 },
      "-s---md--i": { "senatui": 2 },
      "-s---mg--i": { "senatus": 47 },
      "-s---mn--i": { "senatus": 23 }
    })).toEqual({
      "-s---ma--i": { "senatum": 24 },
      "-s---mb--i": { "senatu": 48 },
      "-s---md--i": { "senatui": 2 },
      "-s---mg--i": { "senatus": 47 },
      "-s---mn--i": { "senatus": 23 }
    })
  })
})

describe('makeRegex', () => {
  it('makes a regex', () => {
    expect(makeRegex({
      number: 's',
      case: 'n'
    })).toEqual(/^.s....n...$/)
  })
})

const dicoMappedForms = {
  "-s-g-na--i": { "dicendum": 1 },
  "-s-g-nb--i": { "dicendo": 1 },
  "-s-g-nn--i": { "dicendum": 1 }
};

const dicoDistribution = [
  { id: "caes-gal", n: 73, chronology: { t: -54 }},
  { id: "cic-att", n: 180, chronology: { t: -56 }},
  { id: "latin-nt", n: 2079, chronology: { t: 382 }},
  { id: "per-aeth", n: 194, chronology: { t: 382 }},
];

describe('getMappedForms', () => {
  it('fetches mapped forms', () => {
    expect(getMappedForms(
      dicoMappedForms,
      { gender: 'n', number: 's' },
      { case: 'n' },
      { mood: 'g' }
    )).toEqual([
      { form: "dicendum", morphology: "-s-g-nn--i", n: 1 }
    ])
  })
})

describe('totalDistributionFrequency', () => {
  it('computes the total', () => {
    expect(totalDistributionFrequency(dicoDistribution)).toBe(2526)
  })
})

describe('hasSomeCompositionDate', () => {
  it('detects that distribution has composition date', () => {
    expect(hasSomeCompositionDate(dicoDistribution)).toBe(true)
  })
})

describe('hasSomeManuscriptDate', () => {
  it('detects that distribution has manuscript date', () => {
    expect(hasSomeManuscriptDate(dicoDistribution)).toBe(false)
  })
})
