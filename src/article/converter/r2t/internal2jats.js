import {
  XMLExporter, forEach,
  DefaultDOMElement, DOMElement // eslint-disable-line
} from 'substance'
import JATSSchema from '../../TextureArticle'
import InternalArticleSchema from '../../InternalArticleSchema'
import { createXMLConverters } from '../../shared/xmlSchemaHelpers'
import createEmptyJATS from '../util/createEmptyJATS'
import BodyConverter from './BodyConverter'
import ReferenceConverter from './ReferenceConverter'

/*
  Output will have the following form:

  article:
    (
      front,
      body?,
      back?,
    )
  front:
    (
      journal-meta?,    // not supported yet
      article-meta,
      def-list?         // not supported yet
    )
  article-meta:
    (
      article-id*,      // not supported yet
      article-categories?,  // not supported yet
      title-group?,
      contrib-group*,
      aff*,
      author-notes?,    // not supported yet
      pub-date*,
      volume?,
      issue?,
      isbn?,
      (((fpage,lpage?)?,page-range?)|elocation-id)?,
      history?,
      permissions?,     // not supported yet
      self-uri*,        // not supported yet
      related-article*, // not supported yet
      related-object*,  // not supported yet
      abstract?,
      trans-abstract*,
      kwd-group*,
      funding-group*,   // not supported yet
      conference*,      // not supported yet
      counts?,          // not supported yet
      custom-meta-group?  // not supported yet
    )
  back:
    (
      ack*,
      bio*,
      fn-group?,
      glossary?,
      ref-list?,
      notes*,
      sec*
    )

  TODO:
    Allow only one place for '<ack>', '<bio>', '<fn-group>', '<glossary>', '<notes>'
*/

export default function internal2jats (doc) { // eslint-disable-line
  let jats = createEmptyJATS()
  jats.$$ = jats.createElement.bind(jats)

  // we use this exporter for JATS compliant parts of our intneral document
  let jatsExporter = _createExporter(jats, doc)

  // metadata
  _populateFront(jats, doc, jatsExporter)
  _populateBody(jats, doc, jatsExporter)
  // _populateBack(jats, doc)

  return jats
}

function _createExporter (jats, doc) {
  // Note: we are applying a hybrid approach, i.e. we create XML importers for the JATS schema
  // but only for those elements which are supported by our internal article schema.
  let jatsSchema = JATSSchema.xmlSchema
  let tagNames = jatsSchema.getTagNames().filter(name => Boolean(InternalArticleSchema.getNodeClass(name)))
  let jatsConverters = createXMLConverters(JATSSchema.xmlSchema, tagNames)
  // ATTENTION: in this case it is different to the importer
  // not the first matching converter is used, but the last one which is
  // registered for a specific nody type, i.e. a later converter overrides a previous one
  let converters = jatsConverters.concat([
    new BodyConverter(),
    ReferenceConverter,
    UnsupportedNodeExporter
  ])
  let exporter = new XMLExporter({
    converters,
    elementFactory: {
      createElement: jats.createElement.bind(jats)
    }
  })
  exporter.state.doc = doc
  return exporter
}

function _populateFront (jats, doc, jatsExporter) {
  // TODO: journal-meta would go here, but is not supported yet

  _populateArticleMeta(jats, doc, jatsExporter)

  // TODO: def-list would go here, but is not supported yet
}

function _populateArticleMeta (jats, doc, jatsExporter) {
  const $$ = jats.$$
  let articleMeta = jats.createElement('article-meta')

  // article-id*
  // TODO not supported yet

  // article-categories?
  // TODO not supported yet
  // or do we want derive them from keywords and subjects?

  // title-group?
  let titleGroup = jats.createElement('title-group')
  articleMeta.append(titleGroup)
  _populateTitleGroup(jats, doc, titleGroup, jatsExporter)

  // contrib-group*
  articleMeta.append(_exportContribGroup(jats, doc, doc.get('authors'), 'author'))
  articleMeta.append(_exportContribGroup(jats, doc, doc.get('editors'), 'editor'))
  // TODO: add more types

  // aff*
  articleMeta.append(_exportAffiliations(jats, doc))

  // author-notes? // not supported yet

  let articleRecord = doc.get('article-record')

  // pub-date*,
  articleMeta.append(
    _exportDate($$, articleRecord, 'publishedDate', 'pub', 'pub-date')
  )

  // volume?,
  if (articleRecord.volume) {
    articleMeta.append($$('volume').append(articleRecord.volume))
  }

  // issue?,
  if (articleRecord.issue) {
    articleMeta.append($$('issue').append(articleRecord.issue))
  }

  // isbn?, // not supported yet

  // (((fpage,lpage?)?,page-range?)|elocation-id)?,
  if (articleRecord.elocationId) {
    articleMeta.append(
      $$('elocation-id').append(articleRecord.elocationId)
    )
  } else if (articleRecord.fpage && articleRecord.lpage) {
    // NOTE: last argument is used to resolve insert position, as we don't have means
    // yet to ask for insert position of multiple elements
    let pageRange = articleRecord.pageRange || articleRecord.fpage + '-' + articleRecord.lpage
    articleMeta.append(
      $$('fpage').append(articleRecord.fpage),
      $$('lpage').append(articleRecord.lpage),
      $$('page-range').append(pageRange)
    )
  }

  // history?,
  const historyEl = $$('history')
  historyEl.append(_exportDate($$, articleRecord, 'acceptedDate', 'accepted'))
  historyEl.append(_exportDate($$, articleRecord, 'receivedDate', 'received'))
  historyEl.append(_exportDate($$, articleRecord, 'revReceivedDate', 'rev-recd'))
  historyEl.append(_exportDate($$, articleRecord, 'revRequestedDate', 'rev-request'))
  articleMeta.append(historyEl)

  // permissions?,     // not supported yet

  // self-uri*,        // not supported yet

  // related-article*, // not supported yet

  // related-object*,  // not supported yet

  // abstract?,
  articleMeta.append(
    _extractAbstract(jats, doc, jatsExporter)
  )

  // trans-abstract*, // not yet supported

  // kwd-group*,
  articleMeta.append(
    _exportKeywords(jats, doc, jatsExporter)
  )

  // funding-group*,
  articleMeta.append(
    _exportFundingGroups(jats, doc, jatsExporter)
  )

  // conference*,      // not supported yet

  // counts?,          // not supported yet

  // custom-meta-group?  // not supported yet

  // replace the <article-meta> element
  let front = jats.find('article > front')
  let oldArticleMeta = front.find('article-meta')
  front.replaceChild(oldArticleMeta, articleMeta)
}

function _populateTitleGroup (jats, doc, titleGroup, jatsExporter) {
  // ATTENTION: ATM only one, *the* title is supported
  // Potentially there are sub-titles, and JATS even supports more titles beyond this (e.g. for special purposes)
  let articleTitle = jats.createElement('article-title')
  _exportAnnotatedText(jatsExporter, doc.get('title').getPath(), articleTitle)
  titleGroup.append(articleTitle)
}

function _exportContribGroup (jats, doc, personCollection, type) {
  let $$ = jats.$$
  let contribs = personCollection.getChildren()
  let contribGroup = $$('contrib-group').attr('content-type', type)
  let groupedContribs = _groupContribs(contribs)
  forEach(groupedContribs, (val, key) => {
    // persons without a group
    if (key === 'NOGROUP') {
      val.forEach(person => {
        contribGroup.append(_exportPerson($$, person))
      })
    // persons within a group are nested
    } else {
      let group = doc.get(key)
      let persons = val
      contribGroup.append(_exportGroup($$, group, persons))
    }
  })
  return contribGroup
}

/*
  Uses group association of person nodes to create groups

  [p1,p2g1,p3g2,p4g1] => {p1: p1, g1: [p2,p4], g2: [p3] }
*/
function _groupContribs (contribs) {
  let groups = { 'NOGROUP': [] }
  contribs.forEach(contrib => {
    if (contrib.group) {
      let group = groups[contrib.group]
      if (!group) {
        groups[contrib.group] = group = []
      }
      group.push(contrib)
    } else {
      groups['NOGROUP'].push(contrib)
    }
  })
  return groups
}

function _exportPerson ($$, node) {
  let el = $$('contrib').attr({
    'contrib-type': 'person',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    'corresp': node.corresp ? 'yes' : 'no',
    'deceased': node.deceased ? 'yes' : 'no'
  })
  el.append(
    $$('name').append(
      _createTextElement($$, node.surname, 'surname'),
      _createTextElement($$, node.givenNames, 'given-names'),
      _createTextElement($$, node.prefix, 'prefix'),
      _createTextElement($$, node.suffix, 'suffix')
    ),
    _createTextElement($$, node.email, 'email')
  )
  node.affiliations.forEach(organisationId => {
    el.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', organisationId)
    )
  })
  node.awards.forEach(awardId => {
    el.append(
      $$('xref').attr('ref-type', 'award').attr('rid', awardId)
    )
  })
  return el
}

function _exportGroup ($$, node, groupMembers) {
  let el = $$('contrib').attr({
    'id': node.id,
    'contrib-type': 'group',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    'corresp': node.corresp ? 'yes' : 'no'
  })
  let collab = $$('collab')
  collab.append(
    $$('named-content').attr('content-type', 'name').append(node.name),
    $$('email').append(node.email)
  )
  // Adds affiliations to group
  node.affiliations.forEach(organisationId => {
    el.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', organisationId)
    )
  })
  // Add awards to group
  node.awards.forEach(awardId => {
    el.append(
      $$('xref').attr('ref-type', 'award').attr('rid', awardId)
    )
  })
  // Add group members
  // <contrib-group contrib-type="group-member">
  let contribGroup = $$('contrib-group').attr('contrib-type', 'group-member')
  groupMembers.forEach(person => {
    let contribEl = _exportPerson($$, person)
    contribGroup.append(contribEl)
  })
  collab.append(contribGroup)
  el.append(collab)
  return el
}

function _exportAffiliations (jats, doc) {
  let $$ = jats.$$
  let organisations = doc.get('organisations')
  let orgEls = organisations.getChildren().map(node => {
    let el = $$('aff').attr('id', node.id)
    el.append(_createTextElement($$, node.name, 'institution', {'content-type': 'orgname'}))
    el.append(_createTextElement($$, node.division1, 'institution', {'content-type': 'orgdiv1'}))
    el.append(_createTextElement($$, node.division2, 'institution', {'content-type': 'orgdiv2'}))
    el.append(_createTextElement($$, node.division3, 'institution', {'content-type': 'orgdiv3'}))
    el.append(_createTextElement($$, node.street, 'addr-line', {'content-type': 'street-address'}))
    el.append(_createTextElement($$, node.addressComplements, 'addr-line', {'content-type': 'complements'}))
    el.append(_createTextElement($$, node.city, 'city'))
    el.append(_createTextElement($$, node.state, 'state'))
    el.append(_createTextElement($$, node.postalCode, 'postal-code'))
    el.append(_createTextElement($$, node.country, 'country'))
    el.append(_createTextElement($$, node.phone, 'phone'))
    el.append(_createTextElement($$, node.fax, 'fax'))
    el.append(_createTextElement($$, node.email, 'email'))
    el.append(_createTextElement($$, node.uri, 'uri', {'content-type': 'link'}))
    return el
  })
  return orgEls
}

function _exportDate ($$, node, prop, dateType, tag) {
  const date = node[prop]
  const tagName = tag || 'date'
  const el = $$(tagName).attr('date-type', dateType)
    .attr('iso-8601-date', date)

  const year = date.split('-')[0]
  const month = date.split('-')[1]
  const day = date.split('-')[2]
  if (_isDateValid(date)) {
    el.append(
      $$('day').append(day),
      $$('month').append(month),
      $$('year').append(year)
    )
  } else if (_isYearMonthDateValid(date)) {
    el.append(
      $$('month').append(month),
      $$('year').append(year)
    )
  } else if (_isYearDateValid(date)) {
    el.append(
      $$('year').append(year)
    )
  }
  return el
}

function _isDateValid (str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  if (!regexp.test(str)) return false
  return true
}

function _isYearMonthDateValid (str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])$/
  if (!regexp.test(str)) return false
  return true
}

function _isYearDateValid (str) {
  const regexp = /^[0-9]{4}$/
  if (!regexp.test(str)) return false
  return true
}

function _createTextElement ($$, text, tagName, attrs) {
  if (text) {
    let el = $$(tagName).append(text)
    forEach(attrs, (value, key) => {
      el.attr(key, value)
    })
    return el
  }
}

/**
 * @param {DOMElement} jats the JATS DOM to export into
 * @param {Document} doc the document to convert from
 * @param {XMLExporter} jatsExporter an exporter instance used to export nested nodes
 */
function _extractAbstract (jats, doc, jatsExporter) {
  const $$ = jats.$$
  let abstractEl = $$('abstract')
  let abstract = doc.get('abstract')
  abstract.getChildren().forEach(p => {
    abstractEl.append(jatsExporter.convertNode(p))
  })
  return abstractEl
}

function _exportKeywords (jats, doc) {
  const $$ = jats.$$
  // TODO: keywords should be translatables
  const keywords = doc.get('keywords')
  const kwdGroup = $$('kwd-group')
  keywords.getChildren().forEach(keyword => {
    kwdGroup.append(
      _createTextElement($$, keyword.name, 'kwd', {'content-type': keyword.category})
    )
  })
  return kwdGroup
}

function _exportFundingGroups (jats, doc) {
  const $$ = jats.$$
  let awards = doc.get('awards')
  if (awards.length > 0) {
    let fundingGroupEl = $$('funding-group')
    awards.forEach(award => {
      let el = $$('award-group').attr('id', award.id)
      let institutionWrapEl = $$('institution-wrap')
      institutionWrapEl.append(_createTextElement($$, award.fundRefId, 'institution-id', {'institution-id-type': 'FundRef'}))
      institutionWrapEl.append(_createTextElement($$, award.institution, 'institution'))
      el.append(
        $$('funding-source').append(institutionWrapEl),
        _createTextElement($$, award.awardId, 'award-id')
      )
      fundingGroupEl.append(el)
    })
    return fundingGroupEl
  }
}

/*
function _exportSubjects (dom, api) {
  const $$ = dom.createElement.bind(dom)
  const articleMeta = dom.find('article-meta')
  const doc = api.doc

  let articleCategories = $$('article-categories')
  insertChildAtFirstValidPos(articleMeta, articleCategories)

  // Export Subjects
  const subjectIdx = doc.findByType('_subject')
  const subjects = subjectIdx.map(subjectId => doc.get(subjectId))
  const subjectLangs = [...new Set(subjects.map(item => item.language))]
  subjectLangs.forEach(lang => {
    const subjGroup = $$('subj-group').setAttribute('xml:lang', lang)
    articleCategories.append(subjGroup)
  })
  subjects.forEach(subject => {
    const subjGroup = articleCategories.find(`subj-group[xml\\:lang="${subject.language}"]`)
    const newSubjectEl = SubjectConverter.export($$, subject, doc)
    subjGroup.append(newSubjectEl)
  })
}
export const SubjectConverter = {

  export ($$, node) {
    return _createTextElement($$, node.name, 'subject', { 'content-type': node.category })
  }
}
*/

function _populateBody (jats, doc, jatsExporter) {
  let body = doc.get('body')
  let bodyEl = jatsExporter.convertNode(body)
  let oldBody = jats.find('article > body')
  oldBody.parentNode.replaceChild(oldBody, bodyEl)
}

function _exportAnnotatedText (jatsExporter, path, el) {
  el.append(jatsExporter.annotatedText(path))
}

const UnsupportedNodeExporter = {
  type: 'unsupported-node',
  export (node, el) {
    return DefaultDOMElement.parseSnippet(node.data, 'xml')
  }
}
