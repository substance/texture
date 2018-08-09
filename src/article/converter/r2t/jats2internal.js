import InternalArticleSchema from '../../InternalArticleSchema'
import InternalArticle from '../../InternalArticleDocument'

export default function jats2internal (jats, api) {
  // Create an empty document
  // TODO: how could we support custom nodes coming from configurator?
  let doc = InternalArticle.createEmptyArticle(InternalArticleSchema)

  _populateAffiliations(doc, jats)
  _populateAuthors(doc, jats)
  _populateEditors(doc, jats)
  _populateAwards(doc, jats)

  return doc
}

// function _populateArticleRecord (doc, jats) {
//   let articleRecord = doc.get('article-record')
// }

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

function getText (rootEl, selector) {
  let el = rootEl.find(selector)
  if (el) {
    return el.textContent
  } else {
    return ''
  }
}
