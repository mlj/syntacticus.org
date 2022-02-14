import schema from './data/schema.json';

const TREEBANK_NAMES = {
  proiel: 'The PROIEL Treebank',
  iswoc: 'The ISWOC Treebank',
  torot: 'The TOROT Treebank',
  syntacticus: 'Syntacticus Dictionaries',
};

const TREEBANK_MAIN_URLS = {
  proiel: 'https://proiel.github.io/',
  iswoc: 'https://iswoc.github.io/',
  torot: 'https://torottreebank.github.io/',
  syntacticus: 'http://syntacticus.org',
};

const TREEBANK_RELEASE_URLS = {
  proiel: 'https://github.com/proiel/proiel-treebank/releases/tag/',
  iswoc: 'https://github.com/iswoc/iswoc-treebank/releases/tag/',
  torot: 'https://github.com/torottreebank/treebank-releases/releases/tag/',
  syntacticus: 'https://github.com/proiel/syntacticus-dictionaries/releases/tag/',
};

export const permanentURLs = {
  sentence: (gid) => `http://syntacticus.org/sentence/${gid}`,
  source: (gid) => `http://syntacticus.org/source/${gid}`,
  lemma: (gid) => `http://syntacticus.org/lemma/${gid}`,
  dictionary: (gid) => `http://syntacticus.org/dictionary/${gid}`,
};

export function makeDictionaryGID(language) {
  return ['syntacticus', '20180920', language].join(':');
}

export function makeLemmaGID(dictionaryGID, lemma, partOfSpeech, variant) {
  if (variant === undefined || variant === null || variant === '')
    return [dictionaryGID, lemma, partOfSpeech].join(':')
  else
    return [dictionaryGID, lemma, partOfSpeech, variant].join(':')
}

export function splitLemmaGID(lemmaGID) {
  let [treebank, version, language, lemma, partOfSpeech, variant] = lemmaGID.split(':');
  let dictionaryGID = [treebank, version, language].join(':');

  // TODO: figure out where malformed GIDs with # come from
  if (lemma.includes('#')) {
    [lemma, variant] = lemma.split('#')
  }

  return { treebank, version, language, dictionaryGID, lemmaGID, lemma, partOfSpeech, variant };
}

export function splitDictionaryGID(dictionaryGID) {
  let [treebank, version, language] = dictionaryGID.split(':');

  return { treebank, version, language, dictionaryGID };
}

export function treebankFromGID(gid) {
  let [id, version] = gid.split(':');

  return {
    id: id,
    version: version,
    name: TREEBANK_NAMES[id],
    mainURL: TREEBANK_MAIN_URLS[id],
    citationURL: TREEBANK_MAIN_URLS[id] + '#citation',
    releaseURL: TREEBANK_RELEASE_URLS[id] + version,
  };
}

// Hard-coded stuff that needs to go into the upstream XML files when possible
const ETEXT_CTS = {
  'cic-att': 'urn:cts:latinLit:phi0474.phi057.perseus-lat1',
  'caes-gal': 'urn:cts:latinLit:phi0448.phi001.perseus-lat1',
  'caes-civ': 'urn:cts:latinLit:phi0448.phi002.perseus-lat1',
  'pl-am': 'urn:cts:latinLit:phi0119.phi001.perseus-lat1',
};

export function eText(textGID) {
  let [/* treebank */, /* version */, textID] = textGID.split(':');
  let cts = ETEXT_CTS[textID];

  if (cts) {
    let catalogueURL = `http://data.perseus.org/catalog/${cts}`;
    let readerURL = 'http://cts.perseids.org/read/' + cts.split(/[:.]/).slice(2).join('/');

    return {
      catalogueURL: catalogueURL,
      readerURL: readerURL,
      id: cts,
    };
  } else
    return null;
}

export const languages = {
  grc: 'Ancient Greek',
  lat: 'Latin',
  orv: 'Old Russian',
  chu: 'Old Church Slavonic',
  got: 'Gothic',
  ang: 'Old English',
  xcl: 'Classical Armenian',
  fro: 'Old French',
  por: 'Portuguese',
  spa: 'Spanish',
  // ave: 'Avestan',
  // goh: 'Old High German',
  // hit: 'Hittie',
  // lit: 'Lithuanian',
  // non: 'Old Norse',
  // osc: 'Oscan',
  // prg: 'Old Prussian',
  // san: 'Vedic Sanskrit',
  // sga: 'Old Irish',
  // txb: 'Tocharian B',
  // xlc: 'Lycian',
  // xlu: 'Luvian',
  // xto: 'Tocharian A',
  // xum: 'Umbrian'
};

export const partsOfSpeech = schema.part_of_speech;
