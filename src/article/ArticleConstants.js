export const PUB_ID_TYPES = {
  'journal': ['doi', 'pmid'],
  'book': ['doi', 'pmid', 'isbn']
}

export const PUB_ID_TYPE_LABELS = {
  'doi': 'DOI',
  'pmid': 'PubMed ID',
  'isbn': 'ISBN'
}

// Elements that must be auto-expanded in InternalArticle <element-citation>
// NOTE: content-loc must be extracted and prefilled manually (see ConvertElementCitation)
export const REQUIRED_ELEMENT_CITATION_ELEMENTS = [
  ['person-group', 'person-group-type', 'author'],
  ['person-group', 'person-group-type', 'editor'],
  ['article-title'],
  ['chapter-title'],
  ['edition'],
  ['issue'],
  ['source'],
  ['volume'],
  ['comment'],
  ['year'],
  ['publisher-loc'],
  ['publisher-name'],
  ['conf-name'],
  ['data-title'],
  ['patent'],
  ['version'],
  ['uri'],
  ['pub-id', 'pub-id-type', 'doi'],
  ['pub-id', 'pub-id-type', 'pmid'],
  ['pub-id', 'pub-id-type', 'isbn']
]

export const JATS_BIBR_TYPES_TO_INTERNAL = {
  'journal': 'journal-article',
  'book': 'book',
  'chapter': 'chapter',
  'confproc': 'conference-paper',
  'data': 'data-publication',
  'patent': '_patent',
  'newspaper': 'newspaper-article',
  'magazine': 'magazine-article',
  'report': 'report',
  'software': 'software',
  'thesis': 'thesis',
  'webpage': 'webpage'
}

export const INTERNAL_BIBR_TYPES_TO_JATS = Object.keys(JATS_BIBR_TYPES_TO_INTERNAL).reduce((map, jatsType) => {
  let internalType = JATS_BIBR_TYPES_TO_INTERNAL[jatsType]
  map[internalType] = jatsType
  return map
}, {})

export const JATS_BIBR_TYPES = Object.keys(JATS_BIBR_TYPES_TO_INTERNAL)

export const INTERNAL_BIBR_TYPES = Object.keys(INTERNAL_BIBR_TYPES_TO_JATS)

// EXPERIMENTAL: properties that must not be empty
// TODO: this should be configurable
export const REQUIRED_PROPERTIES = {
  'book': new Set(['authors', 'title']),
  'chapter': new Set(['title', 'containerTitle', 'authors']),
  'data-publication': new Set(['title', 'containerTitle', 'authors']),
  'magazine-article': new Set(['title', 'containerTitle', 'authors']),
  'newspaper-article': new Set(['title', 'containerTitle', 'authors']),
  '_patent': new Set(['title', 'containerTitle', 'inventors']),
  'journal-article': new Set(['title', 'containerTitle', 'authors']),
  'conference-paper': new Set(['title', 'authors']),
  'report': new Set(['title', 'authors']),
  'software': new Set(['title', 'authors']),
  'thesis': new Set(['title', 'authors', 'year']),
  'webpage': new Set(['title', 'containerTitle', 'authors']),
  'person': new Set(['surname', 'givenNames']),
  'ref-contrib': new Set(['name', 'givenNames']),
  'group': new Set(['name']),
  'organisation': new Set(['name']),
  'award': new Set(['institution']),
  'keyword': new Set(['name']),
  '_subject': new Set(['name'])
}
