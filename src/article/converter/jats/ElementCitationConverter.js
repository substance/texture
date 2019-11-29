import {
  JATS_BIBR_TYPES_TO_INTERNAL,
  INTERNAL_BIBR_TYPES_TO_JATS,
  BOOK_REF, REPORT_REF, SOFTWARE_REF, DATA_PUBLICATION_REF, CHAPTER_REF, PERIODICAL_REF
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

  const type = el.attr('publication-type');
  node.type = JATS_BIBR_TYPES_TO_INTERNAL[type];

  // FIXME: Temporary workaround to try and render unsupported citation types.
  if (node.type === undefined)
  {
    console.warn(`Unsupported Citation Type ${type}, defaulting to ${JATS_BIBR_TYPES_TO_INTERNAL["journal"]}`);
    node.type = JATS_BIBR_TYPES_TO_INTERNAL["journal"];
  }

  Object.assign(node, {
    assignee: getText(el, 'collab[collab-type=assignee] > named-content'),
    comment: getText(el, 'comment'),
    confDate: getText(el, 'conf-date'),
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
    uri: getText(el, 'ext-link[ext-link-type=uri]'),
    version: getText(el, 'version'),
    volume: getText(el, 'volume'),
    year: getText(el, 'year'),
    accessedDate: getText(el, 'date-in-citation'),
    // FIXME (#233): The ISO8601 value should be computed.
    accessedDateIso8601: getAttr(el, 'date-in-citation', 'iso-8601-date'),
    // identifiers
    accessionId: getText(el, 'pub-id[pub-id-type=accession]'),
    archiveId: getText(el, 'pub-id[pub-id-type=archive]'),
    arkId: getText(el, 'pub-id[pub-id-type=ark]'),
    isbn: getText(el, 'pub-id[pub-id-type=isbn]'),
    doi: getText(el, 'pub-id[pub-id-type=doi]'),
    pmid: getText(el, 'pub-id[pub-id-type=pmid]'),
    pmcid: getText(el, 'pub-id[pub-id-type=pmcid]')
  })

  if (type === 'book' || type === 'report')
  {
    node.title = getAnnotatedText(importer, el, 'source', [node.id, 'title']);

    if (type === 'book')
    {
      node.chapterTitle = getAnnotatedText(importer, el, 'chapter-title', [node.id, 'title']);
    }
  }
  else
  {
    node.containerTitle = getText(el, 'source')
    if (type === 'chapter')
    {
      node.title = getAnnotatedText(importer, el, 'chapter-title', [node.id, 'title'])
    }
    else if (type === 'data' || type === 'software')
    {
      node.title = getAnnotatedText(importer, el, 'data-title', [node.id, 'title'])
    }
    else
    {
      node.title = getAnnotatedText(importer, el, 'article-title', [node.id, 'title'])
    }
  }

  node.authors = _importPersonGroup(el, doc, 'author')
  node.editors = _importPersonGroup(el, doc, 'editor')
  node.inventors = _importPersonGroup(el, doc, 'inventor')
  node.sponsors = _importPersonGroup(el, doc, 'sponsor')
  node.translators = _importPersonGroup(el, doc, 'translator')

  // FIXME (#233): The ISO8601 value should be computed.
  if (type === 'periodical')
  {
    const stringDateEl = el.find('string-date');
    if (stringDateEl)
    {
      doc.delete(node.stringDate);
      let stringDate = importer.convertElement(stringDateEl);
      // ATTENTION: so that the document model is correct we need to use
      // the Document API to set the stringDate id
      node.stringDate = stringDate.id;
    }
  }

  // TODO: Check if this can be moved into the table above, although needs to be
  //       tested once saving/exported is fully supported.
  if (type === 'data')
  {
    node.specificUse = el.attr('specific-use');
    node.authority = getAttr(el, 'pub-id', 'assigning-authority');
    node.href = getAttr(el, 'pub-id', 'xlink:href');
  }
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
    //refContrib.name = getText(el, 'named-content[content-type=name]')
    refContrib.name = el.textContent;
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
  el.append(_createTextElement($$, node.confDate, 'conf-date'))
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
  el.append(_createTextElement($$, node.uri, 'ext-link', {'ext-link-type': 'uri', 'xlink:href': node.uri}))
  // FIXME (#233): The ISO8601 value should be computed.
  el.append(_createTextElement($$, node.accessedDate, 'date-in-citation', { 'iso-8601-date': node.accessedDateIso8601 }))
  el.append(_createTextElement($$, node.version, 'version'))
  el.append(_createTextElement($$, node.volume, 'volume'))
  el.append(_createTextElement($$, node.year, 'year'))
  el.append(_createTextElement($$, node.comment, 'comment'))
  // identifiers
  if (type == DATA_PUBLICATION_REF)
  {
    // TODO: This needs to be revisited when implementing edit/save support to ensure that multiple elements
    //       aren't written out to the xml.
    el.append(_createTextElement($$, node.accessionId, 'pub-id', { 'pub-id-type': 'accession', 'assigning-authority': node.authority, 'xlink:href': node.href }))
    el.append(_createTextElement($$, node.arkId, 'pub-id', { 'pub-id-type': 'ark', 'assigning-authority': node.authority, 'xlink:href': node.href }))
    el.append(_createTextElement($$, node.archiveId, 'pub-id', { 'pub-id-type': 'archive', 'assigning-authority': node.authority, 'xlink:href': node.href }))
    el.append(_createTextElement($$, node.doi, 'pub-id', { 'pub-id-type': 'doi', 'assigning-authority': node.authority, 'xlink:href': node.href }))
  }
  else
  {
    el.append(_createTextElement($$, node.accessionId, 'pub-id', { 'pub-id-type': 'accession' }))
    el.append(_createTextElement($$, node.arkId, 'pub-id', { 'pub-id-type': 'ark' }))
    el.append(_createTextElement($$, node.archiveId, 'pub-id', { 'pub-id-type': 'archive' }))
    el.append(_createTextElement($$, node.isbn, 'pub-id', { 'pub-id-type': 'isbn' }))
    el.append(_createTextElement($$, node.doi, 'pub-id', { 'pub-id-type': 'doi' }))
    el.append(_createTextElement($$, node.pmid, 'pub-id', { 'pub-id-type': 'pmid' }))
    el.append(_createTextElement($$, node.pmcid, 'pub-id', { 'pub-id-type': 'pmcid' }))
  }
  // creators
  el.append(_exportPersonGroup($$, doc, node.authors, 'author'))
  el.append(_exportPersonGroup($$, doc, node.editors, 'editor'))
  el.append(_exportPersonGroup($$, doc, node.inventors, 'inventor'))
  el.append(_exportPersonGroup($$, doc, node.sponsors, 'sponsor'))

  if (type === BOOK_REF || type === REPORT_REF) {
    el.append(_exportAnnotatedText(exporter, [node.id, 'title'], 'source'))
  } else {
    el.append(_createTextElement($$, node.containerTitle, 'source'))
    if (type === CHAPTER_REF) {
      el.append(
        _exportAnnotatedText(exporter, [node.id, 'title'], 'chapter-title')
      )
    } else if (type === DATA_PUBLICATION_REF || type === SOFTWARE_REF) {
      el.append(
        _exportAnnotatedText(exporter, [node.id, 'title'], 'data-title')
      )
    } else {
      el.append(
        _exportAnnotatedText(exporter, [node.id, 'title'], 'article-title')
      )
    }
  }

  // FIXME (#233): The ISO8601 value should be computed.
  if (type === PERIODICAL_REF)
  {
    let stringDate = doc.get(node.stringDate);
    if (stringDate && !stringDate.isEmpty())
    {
      articleMeta.append(exporter.convertNode(stringDate));
    }
  }

  // TODO: Test once saving/exported is fully supported.
  if (type === 'data')
  {
    el.attr('specific-use', node.specificUse);
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