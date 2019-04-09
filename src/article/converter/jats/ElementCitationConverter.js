import {
  JATS_BIBR_TYPES_TO_INTERNAL,
  INTERNAL_BIBR_TYPES_TO_JATS,
  BOOK_REF, REPORT_REF, SOFTWARE_REF, DATA_PUBLICATION_REF, CHAPTER_REF
} from '../../ArticleConstants'

import { getText, getSeparatedText, getAttr } from '../util/domHelpers'

export default class ElementCitationConverter {
  // Note: this will create different types according to the attributes in the JATS element
  get type () { return 'reference' }

  matchElement (el) {
    return el.is('ref')
  }

  import (el, node, importer) {
    const doc = importer.state.doc
    let elementCitation = el.find('element-citation')
    if (!elementCitation) {
      throw new Error('<element-citation> is required')
    }
    _importElementCitation(elementCitation, node, doc, importer)
  }

  export (node, el, exporter) {
    el.tagName = 'ref'
    el.append(
      _exportElementCitation(node, exporter)
    )
    return el
  }
}

function _importElementCitation (el, node, doc, importer) {
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
    accessedDate: getAttr(el, 'date-in-citation', 'iso-8601-date'),
    // identifiers
    accessionId: getText(el, 'pub-id[pub-id-type=accession]'),
    archiveId: getText(el, 'pub-id[pub-id-type=archive]'),
    arkId: getText(el, 'pub-id[pub-id-type=ark]'),
    isbn: getText(el, 'pub-id[pub-id-type=isbn]'),
    doi: getText(el, 'pub-id[pub-id-type=doi]'),
    pmid: getText(el, 'pub-id[pub-id-type=pmid]')
  })

  if (type === 'book' || type === 'report' || type === 'software') {
    node.title = getAnnotatedText(importer, el, 'source', [node.id, 'title'])
  } else {
    node.containerTitle = getText(el, 'source')
    if (type === 'chapter') {
      node.title = getAnnotatedText(importer, el, 'chapter-title', [node.id, 'title'])
    } else if (type === 'data') {
      node.title = getAnnotatedText(importer, el, 'data-title', [node.id, 'title'])
    } else {
      node.title = getAnnotatedText(importer, el, 'article-title', [node.id, 'title'])
    }
  }

  node.authors = _importPersonGroup(el, doc, 'author')
  node.editors = _importPersonGroup(el, doc, 'editor')
  node.inventors = _importPersonGroup(el, doc, 'inventor')
  node.sponsors = _importPersonGroup(el, doc, 'sponsor')
  node.translators = _importPersonGroup(el, doc, 'translator')
}

function getAnnotatedText (importer, rootEl, selector, path) {
  let el = rootEl.find(selector)
  if (el) {
    return importer.annotatedText(el, path)
  } else {
    return ''
  }
}

function _importPersonGroup (el, doc, type) {
  let groupEl = el.find(`person-group[person-group-type=${type}]`)
  if (groupEl) {
    return groupEl.children.reduce((ids, childEl) => {
      let refContrib = _importRefContrib(doc, childEl)
      if (refContrib) ids.push(refContrib.id)
      return ids
    }, [])
  } else {
    return []
  }
}

function _importRefContrib (doc, el) {
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

function _exportElementCitation (node, exporter) {
  const $$ = exporter.$$
  const doc = node.getDocument()
  const type = node.type
  let el = $$('element-citation').attr('publication-type', INTERNAL_BIBR_TYPES_TO_JATS[type])
  if (node.assignee) {
    el.append(
      $$('collab').attr('collab-type', 'assignee').append(
        $$('named-content').attr({ 'content-type': 'name' }).text(node.assignee)
      )
    )
  }
  el.append(_createTextElement($$, node.confName, 'conf-name'))
  el.append(_createTextElement($$, node.confLoc, 'conf-loc'))
  el.append(_createTextElement($$, node.day, 'day'))
  el.append(_createTextElement($$, node.edition, 'edition'))
  el.append(_createTextElement($$, node.elocationId, 'elocation-id'))
  el.append(_createTextElement($$, node.fpage, 'fpage'))
  el.append(_createTextElement($$, node.issue, 'issue'))
  el.append(_createTextElement($$, node.lpage, 'lpage'))
  el.append(_createTextElement($$, node.month, 'month'))
  el.append(_createTextElement($$, node.pageCount, 'page-count'))
  el.append(_createTextElement($$, node.pageRange, 'page-range'))
  el.append(_createTextElement($$, node.partTitle, 'part-title'))
  el.append(_createTextElement($$, node.patentNumber, 'patent', { 'country': node.patentCountry }))
  el.append(_createMultipleTextElements($$, node.publisherLoc, 'publisher-loc'))
  el.append(_createMultipleTextElements($$, node.publisherName, 'publisher-name'))
  el.append(_createTextElement($$, node.uri, 'uri'))
  el.append(_createTextElement($$, node.accessedDate, 'date-in-citation', { 'iso-8601-date': node.accessedDate }))
  el.append(_createTextElement($$, node.version, 'version'))
  el.append(_createTextElement($$, node.volume, 'volume'))
  el.append(_createTextElement($$, node.year, 'year'))
  // identifiers
  el.append(_createTextElement($$, node.accessionId, 'pub-id', { 'pub-id-type': 'accession' }))
  el.append(_createTextElement($$, node.arkId, 'pub-id', { 'pub-id-type': 'ark' }))
  el.append(_createTextElement($$, node.archiveId, 'pub-id', { 'pub-id-type': 'archive' }))
  el.append(_createTextElement($$, node.isbn, 'pub-id', { 'pub-id-type': 'isbn' }))
  el.append(_createTextElement($$, node.doi, 'pub-id', { 'pub-id-type': 'doi' }))
  el.append(_createTextElement($$, node.pmid, 'pub-id', { 'pub-id-type': 'pmid' }))
  // creators
  el.append(_exportPersonGroup($$, doc, node.authors, 'author'))
  el.append(_exportPersonGroup($$, doc, node.editors, 'editor'))
  el.append(_exportPersonGroup($$, doc, node.inventors, 'inventor'))
  el.append(_exportPersonGroup($$, doc, node.sponsors, 'sponsor'))

  if (type === BOOK_REF || type === REPORT_REF || type === SOFTWARE_REF) {
    el.append(_exportAnnotatedText(exporter, [node.id, 'title'], 'source'))
  } else {
    el.append(_createTextElement($$, node.containerTitle, 'source'))
    if (type === CHAPTER_REF) {
      el.append(
        _exportAnnotatedText(exporter, [node.id, 'title'], 'chapter-title')
      )
    } else if (type === DATA_PUBLICATION_REF) {
      el.append(
        _exportAnnotatedText(exporter, [node.id, 'title'], 'data-title')
      )
    } else {
      el.append(
        _exportAnnotatedText(exporter, [node.id, 'title'], 'article-title')
      )
    }
  }
  return el
}

function _exportPersonGroup ($$, doc, contribIds, personGroupType) {
  if (contribIds && contribIds.length > 0) {
    let el = $$('person-group').attr('person-group-type', personGroupType)
    contribIds.forEach(id => {
      let refContribNode = doc.get(id)
      el.append(
        _exportRefContrib($$, refContribNode)
      )
    })
    return el
  }
}

function _exportRefContrib ($$, refContrib) {
  let el
  if (refContrib.givenNames) {
    el = $$('name')
    el.append(_createTextElement($$, refContrib.name, 'surname'))
    el.append(_createTextElement($$, refContrib.givenNames, 'given-names'))
  } else if (refContrib.name) {
    el = $$('collab')
    el.append(_createTextElement($$, refContrib.name, 'named-content', { 'content-type': 'name' }))
  } else {
    console.warn('No content found for refContrib node')
  }
  return el
}

function _createTextElement ($$, text, tagName, attrs) {
  if (text) {
    return $$(tagName).append(text).attr(attrs)
  }
}

function _exportAnnotatedText (exporter, path, tagName, attrs) {
  const $$ = exporter.$$
  let text = exporter.getDocument().get(path)
  if (text) {
    return $$(tagName).attr(attrs).append(
      exporter.annotatedText(path)
    )
  }
}

function _createMultipleTextElements ($$, text, tagName, attrs) {
  if (text) {
    const textItems = text.split(';')
    return textItems.map(ti => {
      return $$(tagName).append(ti.trim()).attr(attrs)
    })
  }
}
