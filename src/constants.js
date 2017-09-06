export const PUB_ID_TYPES = {
  'journal': ['doi', 'pmid'],
  'book': ['doi', 'pmid', 'isbn']
}

export const PUB_ID_TYPE_LABELS = {
  'doi': 'DOI',
  'pmid': 'PubMed ID',
  'isbn': 'ISBN',
}

// Elements that must be present in TextureJATS <element-citation>
export const REQUIRED_ELEMENT_CITATION_ELEMENTS = [
  'article-title',
  'chapter-title',
  'edition',
  'issue',
  'source',
  'volume',
  'comment',
  'year',
  'publisher-loc',
  'publisher-name'
]
