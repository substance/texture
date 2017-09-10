import getAvailablePubIdTypes from './getAvailablePubIdTypes'

export default function createEmptyRef(doc) {
  let availablePubIdTypes = getAvailablePubIdTypes()
  let ref = doc.createElement('ref')
  let elementCitation = doc.createElement('element-citation').attr('publication-type', 'journal')
  elementCitation.append(
    doc.createElement('person-group').attr('person-group-type', 'author'),
    doc.createElement('year').attr('iso-8601-date', ''),
    doc.createElement('article-title'),
    doc.createElement('chapter-title'),
    doc.createElement('comment'),
    doc.createElement('edition'),
    doc.createElement('source'),
    doc.createElement('volume'),
    doc.createElement('publisher-loc'),
    doc.createElement('publisher-name'),
    doc.createElement('issue'),
    doc.createElement('content-loc').append(
      doc.createElement('fpage'),
      doc.createElement('lpage'),
      doc.createElement('page-range'),
      doc.createElement('elocation-id')
    )
  )
  // Create all available pub id types
  availablePubIdTypes.forEach((pubIdType) => {
    elementCitation.append(
      doc.createElement('pub-id').attr('pub-id-type', pubIdType)
    )
  })

  ref.append(elementCitation)
  return ref
}
