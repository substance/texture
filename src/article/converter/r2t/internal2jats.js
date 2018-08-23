import {
  XMLExporter, forEach
} from 'substance'
import JATSSchema from '../../TextureArticle'
import InternalArticleSchema from '../../InternalArticleSchema'
import { createXMLConverters } from '../../shared/xmlSchemaHelpers'
import createEmptyJATS from '../util/createEmptyJATS'
import BodyConverter from './BodyConverter'
import DispQuoteConverter from './DispQuoteConverter'
import FigConverter from './FigConverter'
import ListConverter from './ListConverter'
import TableConverter from './TableConverter'
import TableWrapConverter from './TableWrapConverter'
import ElementCitationConverter from './ElementCitationConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import XrefConverter from './XrefConverter'

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
      article-categories?,  // derived from subjects
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
      funding-group*,   // derived from awards
      conference*,      // not supported yet
      counts?,          // not supported yet
      custom-meta-group?  // not supported yet
    )
  back:
    (
      ack*, // not supported yet
      bio*, // not supported yet
      fn-group?,
      glossary?,  // not supported yet
      ref-list?,
      notes*, // not supported yet
      sec*  // do we want to support this at all?
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
  _populateBack(jats, doc, jatsExporter)

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
    new DispQuoteConverter(),
    new FigConverter(),
    new ListConverter(),
    new TableWrapConverter(),
    new TableConverter(),
    new ElementCitationConverter(),
    UnsupportedNodeConverter,
    UnsupportedInlineNodeConverter,
    new XrefConverter()
  ])
  let exporter = new Internal2JATSExporter({
    converters,
    elementFactory: {
      createElement: jats.createElement.bind(jats)
    }
  })
  exporter.state.doc = doc
  return exporter
}

class Internal2JATSExporter extends XMLExporter {
  getNodeConverter (node) {
    let type = node.type
    if (node.isInstanceOf('bibr')) {
      type = 'bibr'
    }
    return this.converters.get(type)
  }
}

function _populateFront (jats, doc, jatsExporter) {
  // TODO: journal-meta would go here, but is not supported yet

  _populateArticleMeta(jats, doc, jatsExporter)

  // TODO: def-list would go here, but is not supported yet
}

function _populateArticleMeta (jats, doc, jatsExporter) {
  const $$ = jats.$$
  let articleMeta = jats.createElement('article-meta')
  let articleRecord = doc.get('article-record')

  // article-id*
  // TODO not supported yet

  // article-categories?
  articleMeta.append(_exportSubjects(jats, doc))

  // title-group?
  articleMeta.append(_exportTitleGroup(jats, doc, jatsExporter))

  // contrib-group*
  ;[
    ['author', 'authors'],
    ['editor', 'editors']
  ].forEach(([type, collectionId]) => {
    let collection = doc.get(collectionId)
    articleMeta.append(
      _exportContribGroup(jats, doc, collection, type)
    )
  })

  // aff*
  articleMeta.append(_exportAffiliations(jats, doc))

  // author-notes? // not supported yet

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
    _exportAbstract(jats, doc, jatsExporter)
  )

  // trans-abstract*, // not yet supported

  // kwd-group*,
  articleMeta.append(
    _exportKeywords(jats, doc, jatsExporter)
  )

  // funding-group*,
  articleMeta.append(
    _exportAwards(jats, doc, jatsExporter)
  )

  // conference*,      // not supported yet

  // counts?,          // not supported yet

  // custom-meta-group?  // not supported yet

  // replace the <article-meta> element
  let front = jats.find('article > front')
  let oldArticleMeta = front.find('article-meta')
  front.replaceChild(oldArticleMeta, articleMeta)
}

function _exportSubjects (jats, doc) {
  // NOTE: subjects are used to populate <article-categories>
  // - subjects are organized flat, not hierarchically
  // - `subject.category` is mapped to subject[content-type]
  // - subjects are grouped into <subj-groups> using their language property
  // group subjects by language
  // TODO: this should come from the article node
  let $$ = jats.$$
  let subjects = doc.get('subjects')
  let byLang = subjects.getChildren().reduce((byLang, subject) => {
    let lang = subject.language
    if (!byLang[lang]) {
      byLang[lang] = []
    }
    byLang[lang].push(subject)
    return byLang
  }, {})
  let articleCategories = $$('article-categories')
  forEach(byLang, (subjects, lang) => {
    let groupEl = $$('subj-group').attr('xml:lang', lang)
    groupEl.append(
      subjects.map(subject => {
        return $$('subject').attr({ 'content-type': subject.category }).text(subject.name)
      })
    )
    articleCategories.append(groupEl)
  })
  return articleCategories
}

function _exportTitleGroup (jats, doc, jatsExporter) {
  let $$ = jats.$$
  // ATTENTION: ATM only one, *the* title is supported
  // Potentially there are sub-titles, and JATS even supports more titles beyond this (e.g. for special purposes)
  let title = doc.get('title')
  let titleGroupEl = $$('title-group')
  let articleTitle = $$('article-title')
  _exportAnnotatedText(jatsExporter, title.getPath(), articleTitle)
  titleGroupEl.append(articleTitle)

  // translations
  titleGroupEl.append(
    title.getTranslations().map(translation => {
      return $$('trans-title-group').attr({ 'xml:lang': translation.language })
        .append(
          $$('trans-title').attr({ id: translation.id }).append(
            jatsExporter.annotatedText(translation.getPath())
          )
        )
    })
  )

  return titleGroupEl
}

function _exportContribGroup (jats, doc, personCollection, type) {
  // FIXME: this should not happen if we have general support for 'person-groups'
  // ATM, we only support authors, and editors.
  let $$ = jats.$$
  let contribs = personCollection.getChildren()
  let contribGroupEl = $$('contrib-group').attr('content-type', type)
  let groupedContribs = _groupContribs(contribs)
  for (let [groupId, persons] of groupedContribs) {
    // append persons without a group first
    if (groupId === 'NOGROUP') {
      persons.forEach(person => {
        contribGroupEl.append(_exportPerson($$, person))
      })
    // persons within a group are nested into an extra <contrib> layer
    } else {
      let group = doc.get(groupId)
      contribGroupEl.append(_exportGroup($$, group, persons))
    }
  }
  return contribGroupEl
}

/*
  Uses group association of person nodes to create groups

  [p1,p2g1,p3g2,p4g1] => {p1: p1, g1: [p2,p4], g2: [p3] }
*/
function _groupContribs (contribs) {
  let groups = new Map()
  groups.set('NOGROUP', [])
  for (let contrib of contribs) {
    let groupId = contrib.group
    if (groupId) {
      if (!groups.has(groupId)) {
        groups.set(groupId, [])
      }
      groups.get(groupId).push(contrib)
    } else {
      groups.get('NOGROUP').push(contrib)
    }
  }
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
  /*
    <contrib id="${node.id}" contrib-type="group" equal-contrib="yes|no" corresp="yes|no">
      <collab>
        <named-content content-type="name">${node.name}</named-content>
        <email>${node.email}</email>
        <$ for (let affId of node.affiliations) {$>
          <xref ref-type="aff" rid=${affId} />
        <$ } $>
        <$ for (let awardId of node.awards) {$>
          <xref ref-type="award" rid=${awardId} />
        <$ } $>
        <contrib-group contrib-type="group-member">
          <$ for (let person of groupMembers) {$>
            <Person node=${person} />
          <$ } $>
        </contrib-group>
        </collab>
    </contrib>
  */
  let contribEl = $$('contrib').attr({
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
    collab.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', organisationId)
    )
  })
  // Add awards to group
  node.awards.forEach(awardId => {
    collab.append(
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
  contribEl.append(collab)
  return contribEl
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
function _exportAbstract (jats, doc, jatsExporter) {
  const $$ = jats.$$
  let abstract = doc.get('abstract')
  let abstractEl = $$('abstract')
  abstract.getChildren().forEach(p => {
    abstractEl.append(jatsExporter.convertNode(p))
  })
  let transAbstractEls = abstract.getTranslations().map(translation => {
    return $$('trans-abstract').attr({ id: translation.id, 'xml:lang': translation.language })
      .append(
        translation.getChildren().map(child => jatsExporter.convertNode(child))
      )
  })
  return [abstractEl].concat(transAbstractEls)
}

function _exportKeywords (jats, doc) {
  const $$ = jats.$$
  // TODO: keywords should be translatables
  const keywords = doc.get('keywords')
  let byLang = keywords.getChildren().reduce((byLang, keyword) => {
    let lang = keyword.language
    if (!byLang[lang]) {
      byLang[lang] = []
    }
    byLang[lang].push(keyword)
    return byLang
  }, {})
  let keywordGroups = []
  forEach(byLang, (keywords, lang) => {
    let groupEl = $$('kwd-group').attr('xml:lang', lang)
    groupEl.append(
      keywords.map(keyword => {
        return $$('kwd').attr({ 'content-type': keyword.category }).text(keyword.name)
      })
    )
    keywordGroups.push(groupEl)
  })
  return keywordGroups
}

function _exportAwards (jats, doc) {
  const $$ = jats.$$
  let awards = doc.get('awards').getChildren()
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

function _populateBody (jats, doc, jatsExporter) {
  let body = doc.get('body')
  let bodyEl = jatsExporter.convertNode(body)
  let oldBody = jats.find('article > body')
  oldBody.parentNode.replaceChild(oldBody, bodyEl)
}

function _populateBack (jats, doc, jatsExporter) {
  let $$ = jats.$$
  let backEl = jats.find('article > back')
  /*
    back:
    (
      fn-group?,
      ref-list?,
    )
  */
  let footnotes = doc.get('footnotes').getChildren()
  backEl.append(
    $$('fn-group').append(
      footnotes.map(footnote => {
        return jatsExporter.convertNode(footnote)
      })
    )
  )

  let references = doc.get('references').getChildren()
  backEl.append(
    $$('ref-list').append(
      references.map(ref => {
        return jatsExporter.convertNode(ref)
      })
    )
  )
}

function _exportAnnotatedText (jatsExporter, path, el) {
  el.append(jatsExporter.annotatedText(path))
}
