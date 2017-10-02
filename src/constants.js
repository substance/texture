export const PUB_ID_TYPES = {
  'journal': ['doi', 'pmid'],
  'book': ['doi', 'pmid', 'isbn']
}

export const PUB_ID_TYPE_LABELS = {
  'doi': 'DOI',
  'pmid': 'PubMed ID',
  'isbn': 'ISBN',
}

// Elements that must be auto-expanded in TextureJATS <element-citation>
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
  ['pub-id', 'pub-id-type', 'doi'],
  ['pub-id', 'pub-id-type', 'pmid'],
  ['pub-id', 'pub-id-type', 'isbn']
]
