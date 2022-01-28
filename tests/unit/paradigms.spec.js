import { flattenForms, makeRegex, getForms } from '@/paradigms'

describe('flattenForms', () => {
  it('flattens forms', () => {
    expect(flattenForms({
      "-s---ma--i": { "senatum": 22, "Senatum": 2 },
      "-s---mb--i": { "senatu": 48 },
      "-s---md--i": { "senatui": 2 },
      "-s---mg--i": { "senatus": 47 },
      "-s---mn--i": { "senatus": 23 }
    })).toMatchObject({
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
    })).toMatchObject(/^.s....n..$/)
  })
})

describe('getMappedForms', () => {
  it('fetches mapped forms', () => {
    expect(getMappedForms(
      { "-s-g-nn--i": { "dicendum": 1 }},
      { gender: 'n', number: 's' },
      { case: 'n' },
      { mood: 'g' }
    )).toMatchObject([
      { form: "dicendum", morphology: "-s-g-nn--i", n: 1 }
    ])
  })
})