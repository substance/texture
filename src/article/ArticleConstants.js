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
  'webpage': WEBPAGE_REF,
  'web': WEBPAGE_REF
}

export const INTERNAL_BIBR_TYPES_TO_JATS = Object.keys(JATS_BIBR_TYPES_TO_INTERNAL).reduce((map, jatsType) => {
  let internalType = JATS_BIBR_TYPES_TO_INTERNAL[jatsType]
  map[internalType] = jatsType
  return map
}, {})

export const JATS_BIBR_TYPES = Object.keys(JATS_BIBR_TYPES_TO_INTERNAL)

export const INTERNAL_BIBR_TYPES = Object.keys(INTERNAL_BIBR_TYPES_TO_JATS)

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

// These are intended to be used for labels (lists, references, etc.)
export const LATIN_LETTERS_LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz'
export const LATIN_LETTERS_UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const ROMAN_NUMBERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI']
export const ARABIC_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
export const SYMBOLS = ((symbols, times) => {
  let res = []
  for (let n = 1; n <= times; n++) {
    for (let s of symbols) {
      res.push(new Array(n).fill(s).join(''))
    }
  }
  return res
})(['*', '†', '‡', '¶', '§', '‖', '#'], 4)

export const ABSTRACT_TYPES = [
  {
    id: 'executive-summary',
    name: 'Executive Summary'
  },
  {
    id: 'web-summary',
    name: 'Web Summary'
  }
]

export const JATS_GREEN_1_DTD = 'JATS-archivearticle1.dtd'
export const JATS_GREEN_1_0_PUBLIC_ID = '-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.0 20120330//EN'
export const JATS_GREEN_1_1_PUBLIC_ID = '-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.1 20151215//EN'
export const JATS_GREEN_1_2_PUBLIC_ID = '-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.2 20190208//EN'
// NOTE: this DTD is used mainly internally so it is not so important how it looks like
export const TEXTURE_JATS_PUBLIC_ID = '-//TEXTURE/DTD Texture JATS DTD v1.0'
// TODO: we should maintain a DTD and bundle with texture or have it in the github repo
export const TEXTURE_JATS_DTD = 'TextureJATS-1.0.dtd'

const DEFAULT_JATS_SCHEMA_ID = JATS_GREEN_1_2_PUBLIC_ID
const DEFAULT_JATS_DTD = JATS_GREEN_1_DTD
export { DEFAULT_JATS_SCHEMA_ID, DEFAULT_JATS_DTD }

// TODO: we need a way to specify which namespaces should be declared
export const EMPTY_JATS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "${DEFAULT_JATS_SCHEMA_ID}" "${DEFAULT_JATS_DTD}">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
      <abstract>
      </abstract>
    </article-meta>
  </front>
  <body>
  </body>
  <back>
  </back>
</article>`
