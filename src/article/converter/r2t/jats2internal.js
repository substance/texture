import { uuid } from 'substance'
import InternalArticleSchema from '../../InternalArticleSchema'
import InternalArticle from '../../InternalArticleDocument'
// TODO: rename to XML helpers
import { findChild, getText } from '../util/domHelpers'
import createJatsImporter from './createJatsImporter'

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
      permissions?,     // -> article-record
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

export default function jats2internal (jats, options) {
  let doc = InternalArticle.createEmptyArticle(InternalArticleSchema)
  // this is used to for parts of the DOM where we use JATS in the internal model
  let jatsImporter = createJatsImporter(doc, options)

  // metadata
  _populateOrganisations(doc, jats)
  _populateAuthors(doc, jats, jatsImporter)
  _populateEditors(doc, jats, jatsImporter)
  _populateAwards(doc, jats)
  _populateArticleRecord(doc, jats, jatsImporter)
  _populateKeywords(doc, jats)
  _populateSubjects(doc, jats)

  // content
  _populateTitle(doc, jats, jatsImporter)
  _populateAbstract(doc, jats, jatsImporter)
  _populateBody(doc, jats, jatsImporter)
  _populateFootnotes(doc, jats, jatsImporter)
  _populateReferences(doc, jats, jatsImporter)

  return doc
}

function _populateOrganisations (doc, jats) {
  const organisations = doc.get('organisations')
  const affEls = jats.findAll('article > front > article-meta > aff')
  affEls.forEach(el => {
    let org = {
      id: el.id,
      type: 'organisation',
      institution: getText(el, 'institution[content-type=orgname]'),
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
    organisations.append(doc.create(org))
  })
}

function _populateAuthors (doc, jats, importer) {
  let authors = doc.get('authors')
  let authorEls = jats.findAll(`contrib-group[content-type=author] > contrib`)
  _populateContribs(doc, jats, importer, authors, authorEls)
}

function _populateEditors (doc, jats, importer) {
  let editors = doc.get('editors')
  let editorEls = jats.findAll(`contrib-group[content-type=editor] > contrib`)
  _populateContribs(doc, jats, importer, editors, editorEls)
}

function _populateContribs (doc, jats, importer, contribs, contribEls, groupId) {
  for (let contribEl of contribEls) {
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
      _populateContribs(doc, jats, importer, contribs, memberEls, group.id)
    } else {
      contribs.append(
        doc.create({
          type: 'person',
          givenNames: getText(contribEl, 'given-names'),
          surname: getText(contribEl, 'surname'),
          email: getText(contribEl, 'email'),
          alias: getText(contribEl, 'string-name[content-type=alias]'),
          prefix: getText(contribEl, 'prefix'),
          suffix: getText(contribEl, 'suffix'),
          affiliations: _getAffiliationIds(contribEl),
          awards: _getAwardIds(contribEl),
          bio: _getBio(contribEl, importer),
          equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
          corresp: contribEl.getAttribute('corresp') === 'yes',
          deceased: contribEl.getAttribute('deceased') === 'yes',
          group: groupId
        })
      )
    }
  }
}

function _getBio (el, importer) {
  let $$ = el.createElement.bind(el.getOwnerDocument())
  let bioEl = findChild(el, 'bio')

  // If there is no bio element we should provide it
  if (!bioEl) {
    bioEl = $$('bio')
  }

  // drop everything than 'p' from bio
  let bioContent = bioEl.children
  for (let idx = bioContent.length - 1; idx >= 0; idx--) {
    let child = bioContent[idx]
    if (child.tagName !== 'p') {
      bioEl.removeAt(idx)
    }
  }
  // there must be at least one paragraph
  if (!bioEl.find('p')) {
    bioEl.append($$('p'))
  }

  return importer.convertElement(bioEl).id
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
  const awardEls = jats.findAll('article > front > article-meta > funding-group > award-group')
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

// TODO: use doc API for manipulation, not a bare object
function _populateArticleRecord (doc, jats, jatsImporter) {
  let articleMetaEl = jats.find('article > front > article-meta')
  let articleRecord = doc.get('article-record')
  _assign(articleRecord, {
    elocationId: getText(articleMetaEl, 'elocation-id'),
    fpage: getText(articleMetaEl, 'fpage'),
    lpage: getText(articleMetaEl, 'lpage'),
    issue: getText(articleMetaEl, 'issue'),
    volume: getText(articleMetaEl, 'volume'),
    pageRange: getText(articleMetaEl, 'page-range')
  })
  // Import permission if present
  const permissionsEl = articleMetaEl.find('permissions')
  // An empty permission is already there, but will be replaced if <permission> element is there
  if (permissionsEl) {
    doc.delete(articleRecord.permission)
    let permission = jatsImporter.convertElement(permissionsEl)
    // ATTENTION: so that the document model is correct we need to use
    // the Document API  to set the permission id
    _assign(articleRecord, {
      permission: permission.id
    })
  }

  const articleDateEls = articleMetaEl.findAll('history > date, pub-date')
  if (articleDateEls.length > 0) {
    let dates = {}
    articleDateEls.forEach(dateEl => {
      const date = _extractDate(dateEl)
      dates[date.type] = date.value
    })
    _assign(articleRecord, dates)
  }
}

const DATE_TYPES_MAP = {
  'pub': 'publishedDate',
  'accepted': 'acceptedDate',
  'received': 'receivedDate',
  'rev-recd': 'revReceivedDate',
  'rev-request': 'revRequestedDate'
}

function _extractDate (el) {
  const dateType = el.getAttribute('date-type')
  const value = el.getAttribute('iso-8601-date')
  const entityProp = DATE_TYPES_MAP[dateType]
  return {
    value: value,
    type: entityProp
  }
}

function _populateKeywords (doc, jats) {
  let keywords = doc.get('keywords')
  let kwdEls = jats.findAll('article > front > article-meta > kwd-group > kwd')
  kwdEls.forEach(kwdEl => {
    keywords.append(doc.create({
      type: 'keyword',
      name: kwdEl.textContent,
      category: kwdEl.getAttribute('content-type'),
      language: kwdEl.getParent().getAttribute('xml:lang')
    }))
  })
}

function _populateSubjects (doc, jats) {
  // TODO: IMO we need to consolidate this. The original meaning of <subj-group> seems to be
  // to be able to define an ontology, also hierarchically
  // This implementation assumes that subjects are flat.
  // To support translations, multiple subj-groups can be provided with different xml:lang
  let subjects = doc.get('subjects')
  let subjGroups = jats.findAll('article > front > article-meta > article-categories > subj-group')
  // TODO: get this from the article element
  const DEFAULT_LANG = 'en'
  for (let subjGroup of subjGroups) {
    let language = subjGroup.attr('xml:lang') || DEFAULT_LANG
    let subjectEls = subjGroup.findAll('subject')
    for (let subjectEl of subjectEls) {
      subjects.append(doc.create({
        type: 'subject',
        name: subjectEl.textContent,
        category: subjectEl.getAttribute('content-type'),
        language
      }))
    }
  }
}

function _populateTitle (doc, jats, jatsImporter) {
  let title = doc.get('title')
  let titleEl = jats.find('article > front > article-meta > title-group > article-title')
  if (titleEl) {
    _convertAnnotatedText(jatsImporter, titleEl, title)
  }
  // translations
  let titleTranslations = jats.findAll('article > front > article-meta > title-group > trans-title-group > trans-title')
  let translationIds = titleTranslations.map(transTitleEl => {
    let group = transTitleEl.parentNode
    let language = group.attr('xml:lang')
    let translation = doc.create({ type: 'text-translation', id: transTitleEl.id, language })
    _convertAnnotatedText(jatsImporter, transTitleEl, translation)
    return translation.id
  })
  _assign(title, {
    translations: translationIds
  })
}

function _populateAbstract (doc, jats, jatsImporter) {
  let $$ = jats.createElement.bind(jats)
  // ATTENTION: JATS can have multiple abstracts
  // ATM we only take the first, loosing the others
  let abstractEls = jats.findAll('article > front > article-meta > abstract')
  if (abstractEls.length > 0) {
    let abstractEl = abstractEls[0]
    if (abstractEls.length > 1) {
      console.error('FIXME: Texture only supports one <abstract>.')
    }
    // if the abstract is empty, add an empty paragraph
    if (abstractEl.getChildCount() === 0) {
      abstractEl.append($$('p'))
    }
    let abstract = doc.get('abstract')
    abstractEl.children.forEach(el => {
      abstract.append(jatsImporter.convertElement(el))
    })
  }
  // translations
  let transAbstractEls = jats.findAll('article > front > article-meta > trans-abstract')
  let translationIds = transAbstractEls.map(transAbstractEl => {
    let language = transAbstractEl.attr('xml:lang')
    let _childNodes = transAbstractEl.getChildren().map(child => {
      return jatsImporter.convertElement(child).id
    })
    let translation = doc.create({
      type: 'container-translation',
      id: transAbstractEl.id,
      language,
      _childNodes
    })
    return translation.id
  })
  doc.set(['abstract', 'translations'], translationIds)
}

function _populateBody (doc, jats, jatsImporter) {
  let $$ = jats.createElement.bind(jats)
  // ATTENTION: JATS can have multiple abstracts
  // ATM we only take the first, loosing the others
  let bodyEl = jats.find('article > body')
  if (bodyEl) {
    // add an empty paragraph if the body is empty
    if (bodyEl.getChildCount() === 0) {
      bodyEl.append($$('p'))
    }
    let body = doc.get('body')
    // ATTENTION: because there is already a body node in the document, *the* body, with id 'body'
    // we must use change the id of the body element so that it does not collide with the internal one
    bodyEl.id = uuid()
    let tmp = jatsImporter.convertElement(bodyEl)
    body.append(tmp.children)
    doc.delete(tmp)
  }
}

function _populateFootnotes (doc, jats, jatsImporter) {
  let $$ = jats.createElement.bind(jats)
  let fnEls = jats.findAll('article > back > fn-group > fn')
  let footnotes = doc.get('footnotes')
  fnEls.forEach(fnEl => {
    // there must be at least one paragraph
    if (!fnEl.find('p')) {
      fnEl.append($$('p'))
    }
    footnotes.append(jatsImporter.convertElement(fnEl))
  })
}

function _populateReferences (doc, jats, jatsImporter) {
  let references = doc.get('references')
  // TODO: make sure that we only allow this place for references via restricting the TextureJATS schema
  let refListEl = jats.find('article > back > ref-list')
  if (refListEl) {
    let refEls = refListEl.findAll('ref')
    refEls.forEach(refEl => {
      references.append(jatsImporter.convertElement(refEl))
    })
  }
}

// Helpers

function _convertAnnotatedText (jatsImporter, el, textNode) {
  const doc = jatsImporter.state.doc
  // NOTE: this is a bit difficult but necessary
  // The importer maintains a stack of 'scopes' to deal with recursive calls
  // triggered by converters for nesteded element (annotations and inline nodes)
  jatsImporter.state.pushContext(el.tagName)
  textNode.content = jatsImporter.annotatedText(el, textNode.getPath())
  let context = jatsImporter.state.popContext()
  context.annos.forEach(nodeData => doc.create(nodeData))
}

// would be good to have this as a general Node API
function _assign (node, obj) {
  let doc = node.getDocument()
  let props = Object.keys(obj)
  for (let prop of props) {
    doc.set([node.id, prop], obj[prop])
  }
}
