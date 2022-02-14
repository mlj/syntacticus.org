import { makeLemmaGID, splitLemmaGID } from '@/shared'

describe('makeLemmaGID', () => {
  it('builds a lemma GID without variant', () => {
    expect(makeLemmaGID(
      'syntacticus:20180920:lat',
      'dico',
      'V-',
      undefined
    )).toMatch('syntacticus:20180920:lat:dico:V-')
  })

  it('builds a lemma GID with variant', () => {
    expect(makeLemmaGID(
      'syntacticus:20180920:lat',
      'dico',
      'V-',
      '1'
    )).toMatch('syntacticus:20180920:lat:dico:V-:1')
  })
})

describe('splitLemmaGID', () => {
  it('splits a lemma GID without a variant', () => {
    expect(splitLemmaGID('syntacticus:20180920:lat:dico:V-')).toMatchObject({
      'lemmaGID': 'syntacticus:20180920:lat:dico:V-',
      'dictionaryGID': 'syntacticus:20180920:lat',
      'treebank': 'syntacticus',
      'version': '20180920',
      'language': 'lat',
      'lemma': 'dico',
      'partOfSpeech': 'V-',
      'variant': undefined,
    })
  })

  it('splits a lemma GID with a variant number in the final field', () => {
    expect(splitLemmaGID('syntacticus:20180920:lat:dico:V-:1')).toMatchObject({
      'lemmaGID': 'syntacticus:20180920:lat:dico:V-:1',
      'dictionaryGID': 'syntacticus:20180920:lat',
      'treebank': 'syntacticus',
      'version': '20180920',
      'language': 'lat',
      'lemma': 'dico',
      'partOfSpeech': 'V-',
      'variant': "1",
    })
  })

  it('splits a lemma GID with a variant number embedded in the lemma', () => {
    expect(splitLemmaGID('syntacticus:20180920:lat:dico#1:V-')).toMatchObject({
      'lemmaGID': 'syntacticus:20180920:lat:dico#1:V-',
      'dictionaryGID': 'syntacticus:20180920:lat',
      'treebank': 'syntacticus',
      'version': '20180920',
      'language': 'lat',
      'lemma': 'dico',
      'partOfSpeech': 'V-',
      'variant': "1",
    })
  })

  it('handles non-Latin characters', () => {
    expect(splitLemmaGID('syntacticus:20180920:grc:καί:C-')).toMatchObject({
      'lemmaGID': 'syntacticus:20180920:grc:καί:C-',
      'dictionaryGID': 'syntacticus:20180920:grc',
      'treebank': 'syntacticus',
      'version': '20180920',
      'language': 'grc',
      'lemma': 'καί',
      'partOfSpeech': 'C-',
      'variant': undefined,
    })
  })
})

