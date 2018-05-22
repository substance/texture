import { expandElementCitation } from '../converter/r2t/r2tHelpers'

// TODO: we need to find a way to make sure the element-citation element is valid InternalArticle after creation
// Currently we would fail late somewhere in the UI if we made a mistake here
export default function createEmptyRef(doc) {
  let ref = doc.createElement('ref')
  let elementCitation = doc.createElement('element-citation').attr('publication-type', 'journal')

  elementCitation.append(
    doc.createElement('content-loc').append(
      doc.createElement('fpage'),
      doc.createElement('lpage'),
      doc.createElement('page-range'),
      doc.createElement('elocation-id')
    )
  )

  // Creates empty elements of required fields if not present
  expandElementCitation(elementCitation, doc)
  ref.append(elementCitation)
  return ref
}
