import { forEach, isArray } from 'substance'
import { KeywordConverter, SubjectConverter, PersonConverter, GroupConverter, OrganisationConverter, AwardConverter } from './EntityConverters'
import { insertChildAtFirstValidPos, insertChildrenAtFirstValidPos } from './r2tHelpers'

/*
  This converter takes a JATS `<article-meta>` record
  and creates a transformed one that complies to the InternalArticle Schema.
  Note, that the internal schema deviates from JATS to simplify our life.

  JATS Schema (Restricted version aka TextureJATS):
    (
      article-id*,
      article-categories?,
      title-group?,
      contrib-group*,
      aff*,
      author-notes?,
      pub-date*,
      volume?,
      issue?,
      isbn?,
      (((fpage,lpage?)?,page-range?)|elocation-id)?,
      history?,
      permissions?,
      self-uri*,
      related-article*,
      related-object*,
      abstract?,
      trans-abstract*,
      kwd-group*,
      funding-group*,
      conference*,
      counts?,
      custom-meta-group?
    )

  Internal Schema: (used for all meta-data that is scoped to the article)
    (~unordered
      article-record, // for article-data
      container-record,
      keywords,
      affiliations,
      author-notes,
      permissions,
      related
    )
    (title-group?,contrib-group?,contrib-group?,aff*,author-notes?,pub-date*,volume?,issue?,isbn?,(((fpage,lpage?)?,page-range?)|elocation-id)?,history?,permissions?,self-uri*,(related-article,related-object)*,abstract?,trans-abstract*,kwd-group*,funding-group*,conference*,counts?,custom-meta-group?)

  NOTES:
    - Comparing the specification of bibliography records and the JATS article meta, it is clear
      that there it is built only for a subset of publication types (book)
    - It does not make sense to store container related information on the article-meta element
    - `article-id*, article-categories*, title-group?, contrib-group*, pub-date*, history?` go into `article-record`
    - `volume?, issue?, isbn?, (fpage...)?` go into 'container-record'
    - `abstract, trans-abstract*` go into abstract
    - `kwd-group*' go into 'keywords'

  TODO:
    - article-ids* should go into article-record.ids:string[]
    - article-categories -> article-record.categories:string[]
    - title-group -> article-record.title +
*/
export default class ConvertArticleMeta {
  export (dom, api) {
    _exportKeywords(dom, api)
    _exportSubjects(dom, api)
    // Order is very important here!
    _exportArticleRecord(dom, api)
  }
}

function _exportKeywords (dom, api) {
  const $$ = dom.createElement.bind(dom)
  const articleMeta = dom.find('article-meta')
  const doc = api.doc

  // Export Keywords
  const keywordIdx = doc.findByType('keyword')
  const keywords = keywordIdx.map(kwdId => doc.get(kwdId))
  const keywordLangs = [...new Set(keywords.map(item => item.language))]
  // HACK: we need to reverse
  keywordLangs.reverse()
  keywordLangs.forEach(lang => {
    const kwdGroup = $$('kwd-group').setAttribute('xml:lang', lang)
    // NOTE: this function is only working if the xml is valid currently, don't use it during invalid state
    insertChildAtFirstValidPos(articleMeta, kwdGroup)
  })
  keywords.forEach(kwd => {
    const kwdGroup = dom.find(`article-meta > kwd-group[xml\\:lang="${kwd.language}"]`)
    const newKwdEl = KeywordConverter.export($$, kwd, doc)
    kwdGroup.append(newKwdEl)
  })
}

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

function _exportAffiliations (dom, api) {
  const doc = api.doc
  const articleMeta = dom.find('article-meta')
  const $$ = dom.createElement.bind(dom)
  const organisationIds = doc.findByType('organisation')

  // HACK: we inverse the order since insertChildAtFirstValid pos will lead
  // first in last out
  organisationIds.reverse()

  organisationIds.forEach(organisationId => {
    let node = doc.get(organisationId)
    let newAffEl = OrganisationConverter.export($$, node, doc)
    insertChildAtFirstValidPos(articleMeta, newAffEl)
  })
}

function _exportAwards (dom, api) {
  const doc = api.doc
  const articleMeta = dom.find('article-meta')
  const $$ = dom.createElement.bind(dom)
  const awardIds = doc.findByType('award')

  if (awardIds.length > 0) {
    let fundingGroupEl = $$('funding-group')

    awardIds.forEach(awardId => {
      let node = doc.get(awardId)
      let awardGroupEl = AwardConverter.export($$, node, doc)
      fundingGroupEl.append(awardGroupEl)
    })
    insertChildAtFirstValidPos(articleMeta, fundingGroupEl)
  }
}

/*
  Uses group association of person nodes to create groups

  [p1,p2g1,p3g2,p4g1] => {p1: p1, g1: [p2,p4], g2: [p3] }
*/
function _groupContribs (contribs) {
  let groups = {}
  contribs.forEach(contrib => {
    if (contrib.group) {
      if (groups[contrib.group]) {
        groups[contrib.group].push(contrib.id)
      } else {
        groups[contrib.group] = [contrib.id]
      }
    } else {
      groups[contrib.id] = contrib.id
    }
  })
  return groups
}

function _exportContribs (dom, api, type) {
  const doc = api.doc
  const $$ = dom.createElement.bind(dom)
  const articleMeta = dom.find('article-meta')
  const articleRecord = doc.get('article-record')
  let contribGroup = $$('contrib-group').attr('content-type', type)
  let contribs = articleRecord[type + 's'].map(contribId => doc.get(contribId))
  let groupedContribs = _groupContribs(contribs)
  forEach(groupedContribs, (val, key) => {
    let newContribEl
    if (isArray(val)) { // in case of a group with members
      let group = doc.get(key)
      // NOTE: val has an array of contrib ids to be exported as group members
      newContribEl = GroupConverter.export($$, group, doc, val)
    } else {
      let person = doc.get(key)
      newContribEl = PersonConverter.export($$, person, doc)
    }
    contribGroup.append(newContribEl)
  })
  insertChildAtFirstValidPos(articleMeta, contribGroup)
}

/*
  Export Article Record Node to <article-meta>

  NOTE: We need to be really careful about the element order inside <article-meta>
*/
function _exportArticleRecord (dom, api) {
  const doc = api.doc
  const articleMeta = dom.find('article-meta')
  const node = doc.get('article-record')
  const $$ = dom.createElement.bind(dom)

  _exportAffiliations(dom, api)
  _exportAwards(dom, api)

  // NOTE: we flip the order here as schema based insertion is done first in last out
  _exportContribs(dom, api, 'editor')
  _exportContribs(dom, api, 'author')

  insertChildAtFirstValidPos(articleMeta, $$('volume').append(node.volume))
  insertChildAtFirstValidPos(articleMeta, $$('issue').append(node.issue))

  // Find place for (((fpage, lpage?)?, page-range?) | elocation-id)?
  // HACK: we use isbn for getting the position, as it is located closely and we know it is not used atm
  if (node.elocationId && node.elocationId.length !== '') {
    insertChildAtFirstValidPos(articleMeta, $$('elocation-id').append(node.elocationId))
  } else if (node.fpage && node.lpage) {
    // NOTE: last argument is used to resolve insert position, as we don't have means
    // yet to ask for insert position of multiple elements
    let pageRange = node.pageRange || node.fpage + '-' + node.lpage
    insertChildrenAtFirstValidPos(articleMeta, [
      $$('fpage').append(node.fpage),
      $$('lpage').append(node.lpage),
      $$('page-range').append(pageRange)
    ], 'isbn')
  }

  // Export history
  const historyEl = $$('history')

  historyEl.append(_exportDate($$, node, 'acceptedDate', 'accepted'))
  historyEl.append(_exportDate($$, node, 'receivedDate', 'received'))
  historyEl.append(_exportDate($$, node, 'revReceivedDate', 'rev-recd'))
  historyEl.append(_exportDate($$, node, 'revRequestedDate', 'rev-request'))

  // Export published date
  insertChildAtFirstValidPos(articleMeta, _exportDate($$, node, 'publishedDate', 'pub', 'pub-date'))
  insertChildAtFirstValidPos(articleMeta, historyEl)
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
