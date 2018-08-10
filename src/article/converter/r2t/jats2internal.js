import { XMLDocumentImporter } from 'substance'
import JATSSchema from '../../TextureArticle'
import InternalArticleSchema from '../../InternalArticleSchema'
import InternalArticle from '../../InternalArticleDocument'
import { createXMLConverters } from '../../shared/xmlSchemaHelpers'
import BodyConverter from './BodyConverter'

/*
  TextureJATs Reference: (Please keep this up-to-date)
  article:
    (
      front,
      body?,
      back?,
    )
  front:
    (
      journal-meta?,    // not supported yet
      article-meta,     // -> metadata and others
      // TODO: define a strict schema here ( why multiple ones? )
      (def-list|list|ack|bio|fn-group|glossary|notes)*
    )
  article-meta:
    (
      article-id*,      // not supported yet
      article-categories?,  //   -> article-record
      title-group?,     // this is not optional internally, at least it contains the main title
      contrib-group*,   // -> mapped to authors, editors, and contributors
      aff*,             // -> affiliations
      author-notes?,    // not supported yet
      pub-date*,        // -> article-record
      volume?,          // -> article-record
      issue?,           // -> article-record
      isbn?,            // -> article-record
      (((fpage,lpage?)?,page-range?)|elocation-id)?,  // -> article-record
      history?,         // -> article-record
      permissions?,
      self-uri*,        // not supported yet
      (related-article,related-object)*, // not supported yet
      abstract?,        // -> content.abstract
      trans-abstract*,  // -> translations
      kwd-group*,       // -> keywords
      funding-group*,   // not supported yet
      conference*,      // not supported yet
      counts?,          // not supported yet
      custom-meta-group?  // not supported yet
    )
  back:
    (
      label?,   // not supported
      title*, // not supported
      (ack|app-group|bio|fn-group|glossary|ref-list|notes|sec)* // not supported
    )

  TODO:
    Allow only one place for '<ack>', '<bio>', '<fn-group>', '<glossary>', '<notes>'
*/

export default function jats2internal (jats, api) {
  let doc = InternalArticle.createEmptyArticle(InternalArticleSchema)
  // this is used to for parts of the DOM where we use JATS in the internal model
  let jatsImporter = _createImporter(doc)

  // metadata
  _populateAffiliations(doc, jats)
  _populateAuthors(doc, jats)
  _populateEditors(doc, jats)
  _populateAwards(doc, jats)
  _populateArticleRecord(doc, jats)
  _populateKeywords(doc, jats)
  _populateSubjects(doc, jats)

  // content
  _populateTitle(doc, jats, jatsImporter)
  _populateAbstract(doc, jats, jatsImporter)
  _populateBody(doc, jats, jatsImporter)
  // _populateFootnotes(doc, jats)
  // _populateReferences(doc, jats)

  return doc
}

function _createImporter (doc) {
  // Note: we are applying a hybrid approach, i.e. we create XML importers for the JATS schema
  // but only for those elements which are supported by our internal article schema.
  let jatsSchema = JATSSchema.xmlSchema
  let tagNames = jatsSchema.getTagNames().filter(name => Boolean(InternalArticleSchema.getNodeClass(name)))
  let jatsConverters = createXMLConverters(JATSSchema.xmlSchema, tagNames)
  let converters = [
    // Note: this is actually not used ATM because we populate the body node 'manually'
    HeadingConverter
  ].concat(jatsConverters)
  let jatsImporter = new _HybridJATSImporter({
    schema: InternalArticleSchema,
    xmlSchema: jatsSchema,
    idAttribute: 'id',
    converters
  })
  // ATTENTION: this looks hacky, but we know what we are doing (hopefully)
  jatsImporter.state.doc = doc
  return jatsImporter
}

class _HybridJATSImporter extends XMLDocumentImporter {
  _getConverterForElement (el, mode) {
    let converter = super._getConverterForElement(el, mode)
    if (!converter) {
      if (mode === 'inline') {
        return UnsupportedInlineNodeConverter
      } else {
        return UnsupportedNodeConverter
      }
    }
    return converter
  }
}

function _populateAffiliations (doc, jats) {
  const affiliations = doc.get('affiliations')
  const affEls = jats.findAll('article-meta > aff')
  affEls.forEach(el => {
    let aff = {
      id: el.id,
      type: 'organisation',
      name: getText(el, 'institution[content-type=orgname]'),
      division1: getText(el, 'institution[content-type=orgdiv1]'),
      division2: getText(el, 'institution[content-type=orgdiv2]'),
      division3: getText(el, 'institution[content-type=orgdiv3]'),
      street: getText(el, 'addr-line[content-type=street-address]'),
      addressComplements: getText(el, 'addr-line[content-type=complements]'),
      city: getText(el, 'city'),
      state: getText(el, 'state'),
      postalCode: getText(el, 'postal-code'),
      country: getText(el, 'country'),
      phone: getText(el, 'phone'),
      fax: getText(el, 'fax'),
      email: getText(el, 'email'),
      uri: getText(el, 'uri[content-type=link]')
    }
    affiliations.append(doc.create(aff))
  })
}

function _populateAuthors (doc, jats) {
  let authors = doc.get('authors')
  let authorEls = jats.findAll(`contrib-group[content-type=author] > contrib`)
  _populateContribs(doc, jats, authors, authorEls)
}

function _populateEditors (doc, jats) {
  let editors = doc.get('editors')
  let editorEls = jats.findAll(`contrib-group[content-type=editor] > contrib`)
  _populateContribs(doc, jats, editors, editorEls)
}

function _populateContribs (doc, jats, contribs, contribEls, groupId) {
  contribEls.forEach(contribEl => {
    if (contribEl.attr('contrib-type') === 'group') {
      // ATTENTION: groups are defined 'inplace'
      // the members of the group are appended to the list of persons
      let groups = doc.get('groups')
      let group = {
        id: contribEl.id,
        type: 'group',
        name: getText(contribEl, 'named-content[content-type=name]'),
        email: getText(contribEl, 'email'),
        affiliations: _getAffiliationIds(contribEl, true),
        equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
        corresp: contribEl.getAttribute('corresp') === 'yes',
        awards: _getAwardIds(contribEl)
      }
      groups.append(doc.create(group))

      let memberEls = contribEl.findAll('contrib')
      _populateContribs(doc, jats, contribs, memberEls, group.id)
    } else {
      contribs.append(doc.create({
        type: 'person',
        givenNames: getText(contribEl, 'given-names'),
        surname: getText(contribEl, 'surname'),
        email: getText(contribEl, 'email'),
        prefix: getText(contribEl, 'prefix'),
        suffix: getText(contribEl, 'suffix'),
        affiliations: _getAffiliationIds(contribEl),
        awards: _getAwardIds(contribEl),
        equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
        corresp: contribEl.getAttribute('corresp') === 'yes',
        deceased: contribEl.getAttribute('deceased') === 'yes'
      }))
    }
  })
}

function _getAffiliationIds (el, isGroup) {
  // let dom = el.ownerDocument
  let xrefs = el.findAll('xref[ref-type=aff]')
  // NOTE: for groups we need to extract only affiliations of group, without members
  if (isGroup) {
    xrefs = el.findAll('collab > xref[ref-type=aff]')
  }
  let affs = xrefs.map(xref => xref.attr('rid'))
  return affs
}

function _getAwardIds (el) {
  let xrefs = el.findAll('xref[ref-type=award]')
  let awardIds = xrefs.map(xref => xref.attr('rid'))
  return awardIds
}

function _populateAwards (doc, jats) {
  const awards = doc.get('awards')
  const awardEls = jats.findAll('article-meta > funding-group > award-group')
  // Convert <award-group> elements to award entities
  awardEls.forEach(el => {
    let award = {
      id: el.id,
      type: 'award',
      institution: getText(el, 'institution'),
      fundRefId: getText(el, 'institution-id'),
      awardId: getText(el, 'award-id')
    }
    awards.append(doc.create(award))
  })
}

function _populateArticleRecord (doc, jats) {
  console.error('FIXME: populate article-record')
}
// This is the original implementation
// function _importArticleRecord(dom, api) {
//   let el = dom.find('article-meta')

//   let node = {
//     id: 'article-record',
//     type: 'article-record',
//     elocationId: getText(el, 'elocation-id'),
//     fpage: getText(el, 'fpage'),
//     lpage: getText(el, 'lpage'),
//     issue: getText(el, 'issue'),
//     volume: getText(el, 'volume'),
//     pageRange: getText(el, 'page-range')
//   }
//   const articleDates = el.findAll('history > date, pub-date')
//   articleDates.forEach(dateEl => {
//     const date = _extractDate(dateEl)
//     node[date.type] = date.value
//   })
// }
// const dateTypesMap = {
//   'pub': 'publishedDate',
//   'accepted': 'acceptedDate',
//   'received': 'receivedDate',
//   'rev-recd': 'revReceivedDate',
//   'rev-request': 'revRequestedDate'
// }
// function _extractDate(el) {
//   const dateType = el.getAttribute('date-type')
//   const value = el.getAttribute('iso-8601-date')
//   const entityProp = dateTypesMap[dateType]

//   return {
//     value: value,
//     type: entityProp
//   }
// }


function _populateKeywords (doc, jats) {
  let keywords = doc.get('keywords')
  let kwdEls = jats.findAll('article-meta > kwd-group > kwd')
  kwdEls.forEach(kwdEl => {
    const kwd = {
      type: 'keyword',
      name: kwdEl.textContent,
      category: kwdEl.getAttribute('content-type'),
      language: kwdEl.getParent().getAttribute('xml:lang')
    }
    keywords.append(doc.create(kwd))
  })
}

function _populateSubjects (doc, jats) {
  let subjects = doc.get('subjects')
  let subjectEls = jats.findAll('article-meta > article-categories > subj-group > subject')
  subjectEls.forEach(subjectEl => {
    const subject = {
      // HACK: trying to merge EntitDb into Article model, avoiding type collision
      type: '_subject',
      name: subjectEl.textContent,
      category: subjectEl.getAttribute('content-type'),
      language: subjectEl.getParent().getAttribute('xml:lang')
    }
    subjects.append(doc.create(subject))
  })
}

function _populateTitle (doc, jats, jatsImporter) {
  let titleEl = jats.find('article > front > article-meta > title-group > article-title')
  if (titleEl) {
    let title = doc.get('title')
    _convertAnnotatedText(jatsImporter, titleEl, title)
  }
}

function _populateAbstract (doc, jats, jatsImporter) {
  // ATTENTION: JATS can have multiple abstracts
  // ATM we only take the first, loosing the others
  let abstractEls = jats.findAll('article > front > article-meta > abstract')
  if (abstractEls.length > 0) {
    let abstractEl = abstractEls[0]
    if (abstractEls.length > 1) {
      console.error('FIXME: Texture only supports one <abstract>.')
    }
    let abstract = doc.get('abstract')
    abstractEl.children.forEach(el => {
      abstract.append(jatsImporter.convertElement(el))
    })
  }
}

function _populateBody (doc, jats, jatsImporter) {
  // ATTENTION: JATS can have multiple abstracts
  // ATM we only take the first, loosing the others
  let bodyEl = jats.find('article > body')
  if (bodyEl) {
    let body = doc.get('body')
    BodyConverter.instance().import(bodyEl, body, jatsImporter)
  }
}

// Customized Element converters

const UnsupportedNodeConverter = {
  type: '@unsupported-node',
  matchElement (el) {
    return false
  },
  import (el, node, converter) {
    node.data = el.serialize()
  }
}

const UnsupportedInlineNodeConverter = {
  type: '@unsupported-inline-node',
  matchElement (el) {
    return false
  },
  import (el, node, converter) {
    node.data = el.serialize()
  }
}

const HeadingConverter = {
  type: 'heading',
  tagName: 'heading',
  import (el, node, importer) {
    // Note: attributes are converted automatically
    node.content = importer.annotatedText(el, [node.id, 'content'])
  },
  export (node, el, exporter) {
    console.error('FIXME: implement HeadingConverter.export()')
  }
}

// Helpers

function getText (rootEl, selector) {
  let el = rootEl.find(selector)
  if (el) {
    return el.textContent
  } else {
    return ''
  }
}

function _convertAnnotatedText (jatsImporter, el, textNode) {
  // NOTE: this is a bit difficult but necessary
  // The importer maintains a stack of 'scopes' to deal with recursive calls
  // triggered by converters for nesteded element (annotations and inline nodes)
  jatsImporter.state.pushContext(el.tagName)
  textNode.content = jatsImporter.annotatedText(el, textNode.getPath())
  jatsImporter.state.popContext()
}
