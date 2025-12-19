import {
  makeLemmaGID,
  splitLemmaGID,
  makeDictionaryGID,
  splitDictionaryGID,
  treebankFromGID,
  eText
} from '@/shared'

describe('makeLemmaGID', () => {
  it('builds a lemma GID without variant', () => {
    expect(makeLemmaGID(
      'syntacticus:20180920:lat',
      'dico',
      'V-',
      undefined
    )).toBe('syntacticus:20180920:lat:dico:V-')
  })

  it('builds a lemma GID with variant', () => {
    expect(makeLemmaGID(
      'syntacticus:20180920:lat',
      'dico',
      'V-',
      '1'
    )).toBe('syntacticus:20180920:lat:dico:V-:1')
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

describe('makeDictionaryGID', () => {
  it('creates a dictionary GID from language', () => {
    expect(makeDictionaryGID('lat')).toBe('syntacticus:20180920:lat')
  })
})

describe('splitDictionaryGID', () => {
  it('splits a dictionary GID into components', () => {
    expect(splitDictionaryGID('syntacticus:20180920:lat')).toEqual({
      treebank: 'syntacticus',
      version: '20180920',
      language: 'lat',
      dictionaryGID: 'syntacticus:20180920:lat'
    })
  })
})

describe('treebankFromGID', () => {
  it('returns treebank metadata for proiel', () => {
    const info = treebankFromGID('proiel:20180408')
    expect(info).toMatchObject({
      id: 'proiel',
      version: '20180408',
      name: 'The PROIEL Treebank',
      mainURL: 'https://proiel.github.io/',
      citationURL: 'https://proiel.github.io/#citation',
      releaseURL: 'https://github.com/proiel/proiel-treebank/releases/tag/20180408'
    })
  })
})

describe('eText', () => {
  it('returns CTS info for known text GID', () => {
    const info = eText('proiel:20180408:cic-att')
    expect(info).toEqual({
      catalogueURL: 'http://data.perseus.org/catalog/urn:cts:latinLit:phi0474.phi057.perseus-lat1',
      readerURL: 'http://cts.perseids.org/read/latinLit/phi0474/phi057/perseus-lat1',
      id: 'urn:cts:latinLit:phi0474.phi057.perseus-lat1'
    })
  })

  it('returns null for unknown text GID', () => {
    expect(eText('proiel:20180408:unknown-text')).toBeNull()
  })
})
