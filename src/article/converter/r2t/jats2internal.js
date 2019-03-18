import { uuid, documentHelpers } from 'substance'
import InternalArticleSchema from '../../InternalArticleSchema'
import InternalArticle from '../../InternalArticleDocument'
// TODO: rename to XML helpers
import { findChild, getText, retainChildren } from '../util/domHelpers'
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
      article-categories?,  //   -> metadata
      title-group?,     // this is not optional internally, at least it contains the main title
      contrib-group*,   // -> mapped to authors, editors, and contributors
      aff*,             // -> affiliations
      author-notes?,    // not supported yet
      pub-date*,        // -> metadata
      volume?,          // -> metadata
      issue?,           // -> metadata
      issue-title?,           // -> metadata
      isbn?,            // -> metadata
      (((fpage,lpage?)?,page-range?)|elocation-id)?,  // -> metadata
      history?,         // -> metadata
      permissions?,     // -> metadata
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
  let jatsImporter = createJatsImporter(doc)

  // metadata
  _populateOrganisations(doc, jats)
  _populateAuthors(doc, jats, jatsImporter)
  _populateEditors(doc, jats, jatsImporter)
  _populateFunders(doc, jats)
  _populateArticleInfo(doc, jats, jatsImporter)
  _populateKeywords(doc, jats, jatsImporter)
  _populateSubjects(doc, jats)

  // content
  _populateTitle(doc, jats, jatsImporter)
  _populateSubTitle(doc, jats, jatsImporter)
  _populateAbstract(doc, jats, jatsImporter)
  _populateBody(doc, jats, jatsImporter)
  _populateFootnotes(doc, jats, jatsImporter)
  _populateReferences(doc, jats, jatsImporter)

  return doc
}

function _populateOrganisations (doc, jats) {
  const affEls = jats.findAll('article > front > article-meta > aff')
  let orgIds = affEls.map(el => {
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
    return doc.create(org).id
  })
  doc.set(['metadata', 'organisations'], orgIds)
}

function _populateAuthors (doc, jats, importer) {
  let authorEls = jats.findAll(`contrib-group[content-type=author] > contrib`)
  _populateContribs(doc, jats, importer, ['metadata', 'authors'], authorEls)
}

function _populateEditors (doc, jats, importer) {
  let editorEls = jats.findAll(`contrib-group[content-type=editor] > contrib`)
  _populateContribs(doc, jats, importer, ['metadata', 'editors'], editorEls)
}

function _populateContribs (doc, jats, importer, contribsPath, contribEls, groupId) {
  for (let contribEl of contribEls) {
    if (contribEl.attr('contrib-type') === 'group') {
      // ATTENTION: groups are defined 'inplace'
      // the members of the group are appended to the list of persons
      let group = {
        id: contribEl.id,
        type: 'group',
        name: getText(contribEl, 'named-content[content-type=name]'),
        email: getText(contribEl, 'email'),
        affiliations: _getAffiliationIds(contribEl, true),
        equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
        corresp: contribEl.getAttribute('corresp') === 'yes',
        funders: _getAwardIds(contribEl)
      }
      documentHelpers.append(doc, ['metadata', 'groups'], doc.create(group).id)

      let memberEls = contribEl.findAll('contrib')
      _populateContribs(doc, jats, importer, contribsPath, memberEls, group.id)
    } else {
      let contrib = doc.create({
        id: contribEl.id,
        type: 'person',
        givenNames: getText(contribEl, 'given-names'),
        surname: getText(contribEl, 'surname'),
        email: getText(contribEl, 'email'),
        alias: getText(contribEl, 'string-name[content-type=alias]'),
        prefix: getText(contribEl, 'prefix'),
        suffix: getText(contribEl, 'suffix'),
        affiliations: _getAffiliationIds(contribEl),
        funders: _getAwardIds(contribEl),
        bio: _getBioContent(contribEl, importer),
        equalContrib: contribEl.getAttribute('equal-contrib') === 'yes',
        corresp: contribEl.getAttribute('corresp') === 'yes',
        deceased: contribEl.getAttribute('deceased') === 'yes',
        group: groupId
      })
      documentHelpers.append(doc, contribsPath, contrib.id)
    }
  }
}

// ATTENTION: bio is not a specific node anymore, just a collection of paragraphs
function _getBioContent (el, importer) {
  let $$ = el.createElement.bind(el.getOwnerDocument())
  let bioEl = findChild(el, 'bio')

  // If there is no bio element we should provide it
  if (!bioEl) {
    bioEl = $$('bio')
  }

  // TODO: this code looks similar to what we have in abstract or and caption
  // drop everything other than 'p' from bio
  retainChildren(bioEl, 'p')
  // there must be at least one paragraph
  if (!bioEl.find('p')) {
    bioEl.append($$('p'))
  }

  return bioEl.children.map(child => importer.convertElement(child).id)
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

function _populateFunders (doc, jats) {
  const awardEls = jats.findAll('article > front > article-meta > funding-group > award-group')
  let funderIds = awardEls.map(el => {
    let funder = {
      id: el.id,
      type: 'funder',
      institution: getText(el, 'institution'),
      fundRefId: getText(el, 'institution-id'),
      awardId: getText(el, 'award-id')
    }
    return doc.create(funder).id
  })
  doc.set(['metadata', 'funders'], funderIds)
}

// TODO: use doc API for manipulation, not a bare object
function _populateArticleInfo (doc, jats, jatsImporter) {
  let articleEl = jats.find('article')
  let articleMetaEl = articleEl.find('front > article-meta')
  let metadata = doc.get('metadata')
  Object.assign(metadata, {
    articleType: articleEl.getAttribute('article-type') || '',
    elocationId: getText(articleMetaEl, 'elocation-id'),
    fpage: getText(articleMetaEl, 'fpage'),
    lpage: getText(articleMetaEl, 'lpage'),
    issue: getText(articleMetaEl, 'issue'),
    volume: getText(articleMetaEl, 'volume'),
    pageRange: getText(articleMetaEl, 'page-range')
  })
  let issueTitleEl = findChild(articleMetaEl, 'issue-title')
  if (issueTitleEl) {
    metadata['issueTitle'] = jatsImporter.annotatedText(issueTitleEl, ['metadata', 'issueTtle'])
  }
  // Import permission if present
  const permissionsEl = articleMetaEl.find('permissions')
  // An empty permission is already there, but will be replaced if <permission> element is there
  if (permissionsEl) {
    doc.delete(metadata.permission)
    let permission = jatsImporter.convertElement(permissionsEl)
    // ATTENTION: so that the document model is correct we need to use
    // the Document API  to set the permission id
    metadata.permission = permission.id
  }

  const articleDateEls = articleMetaEl.findAll('history > date, pub-date')
  if (articleDateEls.length > 0) {
    let dates = {}
    articleDateEls.forEach(dateEl => {
      const date = _extractDate(dateEl)
      dates[date.type] = date.value
    })
    Object.assign(metadata, dates)
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

function _populateKeywords (doc, jats, jatsImporter) {
  let kwdEls = jats.findAll('article > front > article-meta > kwd-group > kwd')
  let kwdIds = kwdEls.map(kwdEl => {
    const kwd = doc.create({
      type: 'keyword',
      category: kwdEl.getAttribute('content-type'),
      language: kwdEl.getParent().getAttribute('xml:lang')
    })
    kwd.name = jatsImporter.annotatedText(kwdEl, [kwd.id, 'name'])
    return kwd.id
  })
  doc.get('metadata').keywords = kwdIds
}

function _populateSubjects (doc, jats) {
  // TODO: IMO we need to consolidate this. The original meaning of <subj-group> seems to be
  // to be able to define an ontology, also hierarchically
  // This implementation assumes that subjects are flat.
  // To support translations, multiple subj-groups can be provided with different xml:lang
  let subjGroups = jats.findAll('article > front > article-meta > article-categories > subj-group')
  // TODO: get this from the article element
  const DEFAULT_LANG = 'en'
  for (let subjGroup of subjGroups) {
    let language = subjGroup.attr('xml:lang') || DEFAULT_LANG
    let subjectEls = subjGroup.findAll('subject')
    for (let subjectEl of subjectEls) {
      let subject = doc.create({
        type: 'subject',
        name: subjectEl.textContent,
        category: subjectEl.getAttribute('content-type'),
        language
      })
      documentHelpers.append(doc, ['metadata', 'subjects'], subject.id)
    }
  }
}

function _populateTitle (doc, jats, jatsImporter) {
  let article = doc.get('article')
  let titleEl = jats.find('article > front > article-meta > title-group > article-title')
  if (titleEl) {
    article.title = jatsImporter.annotatedText(titleEl, ['article', 'title'])
  }
  // translations
  let transTitleEls = jats.findAll('article > front > article-meta > title-group > trans-title-group > trans-title')
  for (let transTitleEl of transTitleEls) {
    let group = transTitleEl.parentNode
    let language = group.attr('xml:lang')
    let translation = doc.create({
      type: 'article-title-translation',
      id: transTitleEl.id,
      source: ['article', 'title'],
      language
    })
    translation.content = jatsImporter.annotatedText(transTitleEl, translation.getPath())
    documentHelpers.append(doc, ['article', 'translations'], translation.id)
  }
}

function _populateSubTitle (doc, jats, jatsImporter) {
  let article = doc.get('article')
  let subTitleEl = jats.find('article > front > article-meta > title-group > subtitle')
  if (subTitleEl) {
    article.subTitle = jatsImporter.annotatedText(subTitleEl, ['article', 'subTitle'])
  }
}

function _populateAbstract (doc, jats, jatsImporter) {
  let $$ = jats.createElement.bind(jats)

  // NOTE: The first abstract without abstract-type is used as main abstract,
  // if there are others they should be imported as a custom abstract
  // as well as abstracts with abstract-type attribute
  let mainAbstract = doc.get('abstract')
  let abstractEls = jats.findAll('article > front > article-meta > abstract')
  let mainAbstractImported = false
  abstractEls.forEach(abstractEl => {
    // if the abstract is empty, add an empty paragraph
    if (abstractEl.getChildCount() === 0) {
      abstractEl.append($$('p'))
    }
    const abstractType = abstractEl.attr('abstract-type')
    if (!abstractType && !mainAbstractImported) {
      mainAbstract.content = abstractEl.children.map(el => {
        return jatsImporter.convertElement(el).id
      })
      mainAbstractImported = true
    } else {
      let abstract = doc.create({
        type: 'custom-abstract',
        id: abstractEl.id,
        abstractType: abstractType,
        content: abstractEl.children.map(el => {
          return jatsImporter.convertElement(el).id
        })
      })
      abstract.title = jatsImporter.annotatedText(abstractEl, [abstract.id, 'title'])
      documentHelpers.append(doc, ['article', 'сustomAbstracts'], abstract.id)
    }
  })

  // translations
  let transAbstractEls = jats.findAll('article > front > article-meta > trans-abstract')
  for (let transAbstractEl of transAbstractEls) {
    let language = transAbstractEl.attr('xml:lang')
    let translation = doc.create({
      type: 'article-abstract-translation',
      id: transAbstractEl.id,
      source: [mainAbstract.id, 'content'],
      language,
      content: transAbstractEl.getChildren().map(child => {
        return jatsImporter.convertElement(child).id
      })
    })
    documentHelpers.append(doc, ['article', 'translations'], translation.id)
  }
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
    // we must change the id of the body element so that it does not collide with the internal one
    bodyEl.id = uuid()
    let tmp = jatsImporter.convertElement(bodyEl)
    let ids = tmp.content.slice()
    tmp.content = []
    body.content = ids
    doc.delete(tmp)
  }
}

function _populateFootnotes (doc, jats, jatsImporter) {
  let $$ = jats.createElement.bind(jats)
  let fnEls = jats.findAll('article > back > fn-group > fn')
  let article = doc.get('article')
  article.footnotes = fnEls.map(fnEl => {
    // there must be at least one paragraph
    if (!fnEl.find('p')) {
      fnEl.append($$('p'))
    }
    return jatsImporter.convertElement(fnEl).id
  })
}

function _populateReferences (doc, jats, jatsImporter) {
  // TODO: make sure that we only allow this place for references via restricting the TextureJATS schema
  let refListEl = jats.find('article > back > ref-list')
  if (refListEl) {
    let article = doc.get('article')
    let refEls = refListEl.findAll('ref')
    article.references = refEls.map(refEl => jatsImporter.convertElement(refEl).id)
  }
}
