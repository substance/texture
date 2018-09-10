export const MANUSCRIPT_MODE = 'manuscript'
export const PREVIEW_MODE = 'preview'
export const METADATA_MODE = 'metadata'

export const JATS_BIBR_TYPES_TO_INTERNAL = {
  'journal': 'journal-article-ref',
  'book': 'book-ref',
  'chapter': 'chapter-ref',
  'confproc': 'conference-paper-ref',
  'data': 'data-publication-ref',
  'patent': 'patent-ref',
  'article': 'article-ref',
  'newspaper': 'newspaper-article-ref',
  'magazine': 'magazine-article-ref',
  'report': 'report-ref',
  'software': 'software-ref',
  'thesis': 'thesis-ref',
  'webpage': 'webpage-ref'
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
  'patent': new Set(['title', 'containerTitle', 'inventors']),
  'journal-article': new Set(['title', 'containerTitle', 'authors']),
  'article': new Set(['title', 'containerTitle', 'authors']),
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
  'subject': new Set(['name']),
  'figure': new Set(['title', 'caption'])
}
export const LICENSES = [
  {
    id: 'http://creativecommons.org/licenses/by/4.0/',
    name: 'CC BY 4.0'
  },
  {
    id: 'https://creativecommons.org/licenses/by-sa/2.0/',
    name: 'CC BY-SA 2.0'
  }
]
