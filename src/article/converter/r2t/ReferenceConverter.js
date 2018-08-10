import { JATS_BIBR_TYPES_TO_INTERNAL } from '../../ArticleConstants'
import { getText, getSeparatedText, getHTML, getAttr } from '../util/domHelpers'

export default class ReferenceConverter {
  // Note: this will create different types according to the attributes in the JATS element
  get type () { return 'bibr' }

  matchElement (el) {
    return el.is('ref')
  }

  import (el, node, importer) {
    const doc = importer.state.doc
    let elementCitation = el.find('element-citation')
    if (!elementCitation) {
      throw new Error('<element-citation> is required')
    }
    _convertElementCitation(elementCitation, node, doc)
  }
}

function _convertElementCitation (el, node, doc) {
  const type = el.attr('publication-type')
  node.type = JATS_BIBR_TYPES_TO_INTERNAL[type]

  Object.assign(node, {
    assignee: getText(el, 'collab[collab-type=assignee] > named-content'),
    confName: getText(el, 'conf-name'),
    confLoc: getText(el, 'conf-loc'),
    day: getText(el, 'day'),
    edition: getText(el, 'edition'),
    elocationId: getText(el, 'elocation-id'),
    fpage: getText(el, 'fpage'),
    issue: getText(el, 'issue'),
    lpage: getText(el, 'lpage'),
    month: getText(el, 'month'),
    pageCount: getText(el, 'page-count'),
    pageRange: getText(el, 'page-range'),
    partTitle: getText(el, 'part-title'),
    patentCountry: getAttr(el, 'patent', 'country'),
    patentNumber: getText(el, 'patent'),
    publisherLoc: getSeparatedText(el, 'publisher-loc'),
    publisherName: getSeparatedText(el, 'publisher-name'),
    series: getText(el, 'series'),
    uri: getText(el, 'uri'),
    version: getText(el, 'version'),
    volume: getText(el, 'volume'),
    year: getText(el, 'year'),
    // identifiers
    accessionId: getText(el, 'pub-id[pub-id-type=accession]'),
    archiveId: getText(el, 'pub-id[pub-id-type=archive]'),
    arkId: getText(el, 'pub-id[pub-id-type=ark]'),
    isbn: getText(el, 'pub-id[pub-id-type=isbn]'),
    doi: getText(el, 'pub-id[pub-id-type=doi]'),
    pmid: getText(el, 'pub-id[pub-id-type=pmid]')
  })

  if (type === 'book' || type === 'report' || type === 'software') {
    node.title = getText(el, 'source')
  } else {
    node.containerTitle = getText(el, 'source')
    if (type === 'chapter') {
      node.title = getHTML(el, 'chapter-title')
    } else if (type === 'data') {
      node.title = getHTML(el, 'data-title')
    } else {
      node.title = getHTML(el, 'article-title')
    }
  }

  node.authors = _convertPersonGroup(el, doc, 'author')
  node.editors = _convertPersonGroup(el, doc, 'editor')
  node.inventors = _convertPersonGroup(el, doc, 'inventor')
  node.sponsors = _convertPersonGroup(el, doc, 'sponsor')
  node.translators = _convertPersonGroup(el, doc, 'translator')
}

function _convertPersonGroup (el, doc, type) {
  let groupEl = el.find(`person-group[person-group-type=${type}]`)
  if (groupEl) {
    return groupEl.children.reduce((ids, childEl) => {
      let refContrib = _convertRefContrib(doc, childEl)
      if (refContrib) ids.push(refContrib.id)
      return ids
    }, [])
  } else {
    return []
  }
}

function _convertRefContrib (doc, el) {
  let refContrib = {
    type: 'ref-contrib'
  }
  if (el.tagName === 'name') {
    refContrib.givenNames = getText(el, 'given-names')
    refContrib.name = getText(el, 'surname')
    // TODO: We may want to consider prefix postfix, and mix it into givenNames, or name properties
    // We don't want separate fields because this gets complex/annoying during editing
    // prefix: getText(el, 'prefix'),
    // suffix: getText(el, 'suffix'),
  } else if (el.tagName === 'collab') {
    refContrib.name = getText(el, 'named-content[content-type=name]')
  } else {
    console.warn(`${el.tagName} not supported inside <person-group>`)
    return null
  }
  return doc.create(refContrib)
}
