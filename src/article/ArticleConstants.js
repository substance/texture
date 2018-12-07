export const MANUSCRIPT_MODE = 'manuscript'
export const PREVIEW_MODE = 'preview'
export const METADATA_MODE = 'metadata'

// Reference Types
export const JOURNAL_ARTICLE_REF = 'journal-article-ref'
export const BOOK_REF = 'book-ref'
export const CHAPTER_REF = 'chapter-ref'
export const CONFERENCE_PAPER_REF = 'conference-paper-ref'
export const DATA_PUBLICATION_REF = 'data-publication-ref'
export const PATENT_REF = 'patent-ref'
export const ARTICLE_REF = 'article-ref'
export const NEWSPAPER_ARTICLE_REF = 'newspaper-article-ref'
export const MAGAZINE_ARTICLE_REF = 'magazine-article-ref'
export const REPORT_REF = 'report-ref'
export const SOFTWARE_REF = 'software-ref'
export const THESIS_REF = 'thesis-ref'
export const WEBPAGE_REF = 'webpage-ref'

export const JATS_BIBR_TYPES_TO_INTERNAL = {
  'journal': JOURNAL_ARTICLE_REF,
  'book': BOOK_REF,
  'chapter': CHAPTER_REF,
  'confproc': CONFERENCE_PAPER_REF,
  'data': DATA_PUBLICATION_REF,
  'patent': PATENT_REF,
  'article': ARTICLE_REF,
  'newspaper': NEWSPAPER_ARTICLE_REF,
  'magazine': MAGAZINE_ARTICLE_REF,
  'report': REPORT_REF,
  'software': SOFTWARE_REF,
  'thesis': THESIS_REF,
  'webpage': WEBPAGE_REF
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
  'book-ref': new Set(['authors', 'title']),
  'chapter-ref': new Set(['title', 'containerTitle', 'authors']),
  'data-publication-ref': new Set(['title', 'containerTitle', 'authors']),
  'magazine-article-ref': new Set(['title', 'containerTitle', 'authors']),
  'newspaper-article-ref': new Set(['title', 'containerTitle', 'authors']),
  'patent-ref': new Set(['title', 'containerTitle', 'inventors']),
  'journal-article-ref': new Set(['title', 'containerTitle', 'authors']),
  'article-ref': new Set(['title', 'containerTitle', 'authors']),
  'conference-paper-ref': new Set(['title', 'authors']),
  'report-ref': new Set(['title', 'authors']),
  'software–ref': new Set(['title', 'authors']),
  'thesis-ref': new Set(['title', 'authors', 'year']),
  'webpage-ref': new Set(['title', 'containerTitle', 'authors']),
  'person': new Set(['surname', 'givenNames']),
  'ref-contrib': new Set(['name', 'givenNames']),
  'group': new Set(['name']),
  // FIXME: what is required for organisation?
  'organisation': new Set([]),
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

export const CARD_MINIMUM_FIELDS = 3
