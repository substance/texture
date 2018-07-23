import { KeywordConverter, SubjectConverter, getText } from './EntityConverters'
import { expandAbstract, insertChildAtFirstValidPos, insertChildrenAtFirstValidPos, removeElements } from './r2tHelpers'

/*
  Expands elements in article-meta which are optional in TextureArticle but
  required in InternalArticle.

  TODO: Remove subjects from the DOM after conversion, like we do with keywords
*/
export default class ConvertArticleMeta {

  import(dom, api) {
    expandAbstract(dom)
    _importArticleRecord(dom, api)
    _importKeywords(dom, api)
    _importSubjects(dom, api)

    // We don't need these in InternalArticleXML, as they are represented as entity nodes
    removeElements(dom, [
      'article-meta > kwd-group',
      'history',
      'volume',
      'issue',
      'fpage',
      'lpage',
      'page-range',
      'elocation-id' 
    ])
  }

  export(dom, api) {
    const $$ = dom.createElement.bind(dom)
    const articleMeta = dom.find('article-meta')
    const pubMetaDb = api.pubMetaDb
    
    // Export Keywords
    const keywordIdx = pubMetaDb.findByType('keyword')
    const keywords = keywordIdx.map(kwdId => pubMetaDb.get(kwdId))
    const keywordLangs = [...new Set(keywords.map(item => item.language))]
    keywordLangs.forEach(lang => {
      const kwdGroup = $$('kwd-group').setAttribute('xml-lang', lang)
      // NOTE: this function is only working if the xml is valid currently, don't use it during invalid state
      insertChildAtFirstValidPos(articleMeta, kwdGroup)
    })
    keywords.forEach(kwd => {
      const kwdGroup = dom.find(`article-meta > kwd-group[xml-lang="${kwd.language}"]`)
      const newKwdEl = KeywordConverter.export($$, kwd, pubMetaDb)
      kwdGroup.append(newKwdEl)
    })
    
    // Export Subjects
    const subjects = dom.findAll('article-meta subj-group > subject')
    subjects.forEach(subject => {
      let entity = pubMetaDb.get(subject.attr('rid'))
      let newSubjectEl = SubjectConverter.export($$, entity, pubMetaDb)
      // We want to keep the original document-specific id, and just assign
      // the element's content.
      subject.innerHTML = newSubjectEl.innerHTML
      subject.removeAttr('rid')
    })

    // Order is very important here!
    _exportArticleRecord(dom, api)
  }
}



function _importKeywords(dom, api) {
  const pubMetaDb = api.pubMetaDb
  const keywords = dom.findAll('article-meta > kwd-group > kwd')
  // Convert <kwd> elements to keywords entities
  keywords.forEach(kwd => {
    KeywordConverter.import(kwd, pubMetaDb)
  })
}

function _importSubjects(dom, api) {
  const pubMetaDb = api.pubMetaDb
  const subjects = dom.findAll('article-meta subj-group > subject')
  // Convert <subject> elements to subject entities
  subjects.forEach(subject => {
    let entityId = SubjectConverter.import(subject, pubMetaDb)
    subject.setAttribute('rid', entityId)
    subject.empty()
  })
}


function _importArticleRecord(dom, api) {
  let el = dom.find('article-meta')
  let pubMetaDb = api.pubMetaDb

  let node = {
    id: 'article-record',
    type: 'article-record',
    elocationId: getText(el, 'elocation-id'),
    fpage: getText(el, 'fpage'),
    lpage: getText(el, 'lpage'),
    issue: getText(el, 'issue'),
    volume: getText(el, 'volume'),
    pageRange: getText(el, 'page-range')
  }
  const articleDates = el.findAll('history > date, pub-date')
  articleDates.forEach(dateEl => {
    const date = _extractDate(dateEl)
    node[date.type] = date.value
    dateEl.getParent().removeChild(dateEl)
  })
  
  pubMetaDb.create(node)
}


/*
  Export Article Record Node to <article-meta>

  NOTE: We need to be really careful about the element order inside <article-meta>
*/
function _exportArticleRecord(dom, api) {
  const pubMetaDb = api.pubMetaDb
  const articleMeta = dom.find('article-meta')
  const node = pubMetaDb.get('article-record')
  const $$ = dom.createElement.bind(dom)

  insertChildAtFirstValidPos(articleMeta, $$('volume').append(node.volume))
  insertChildAtFirstValidPos(articleMeta, $$('issue').append(node.issue))

  // Find place for (((fpage, lpage?)?, page-range?) | elocation-id)?
  // HACK: we use isbn for getting the position, as it is located closely and we know it is not used atm
  if (node.elocationId && node.elocationId.length !== '') {
    insertChildAtFirstValidPos(articleMeta, $$('elocation-id').append(node.elocationId))
  } else if (node.fpage && node.lpage) {
    // NOTE: last argument is used to resolve insert position, as we don't have means
    // yet to ask for insert position of a multiple elements
    let pageRange = node.pageRange || node.fpage+'-'+node.lpage
    insertChildrenAtFirstValidPos(articleMeta, [
      $$('fpage').append(node.fpage),
      $$('lpage').append (node.lpage),
      $$('page-range').append(pageRange),
    ], 'isbn')
  }


  // Export history
  const historyEl = $$('history')

  historyEl.append(_exportDate($$, node, 'acceptedDate', 'accepted'))
  historyEl.append(_exportDate($$, node, 'receivedDate', 'received'))
  historyEl.append(_exportDate($$, node, 'revReceivedDate', 'rev-recd'))
  historyEl.append(_exportDate($$, node, 'revRequestedDate', 'rev-request'))

  insertChildAtFirstValidPos(articleMeta, _exportDate($$, node, 'publishedDate', 'pub', 'pub-date'))
  insertChildAtFirstValidPos(articleMeta, historyEl)
}



const dateTypesMap = {
  'pub': 'publishedDate',
  'accepted': 'acceptedDate',
  'received': 'receivedDate',
  'rev-recd': 'revReceivedDate',
  'rev-request': 'revRequestedDate'
}

function _extractDate(el) {
  const dateType = el.getAttribute('date-type')
  const value = el.getAttribute('iso-8601-date')
  const entityProp = dateTypesMap[dateType]

  return {
    value: value,
    type: entityProp
  }
}

function _exportDate($$, node, prop, dateType, tag) {
  const date = node[prop]
  const tagName = tag || 'date'
  const el = $$(tagName).attr('date-type', dateType)
    .attr('iso-8601-date', date)

  const year = date.split('-')[0]
  const month = date.split('-')[1]
  const day = date.split('-')[2]
  if(_isDateValid(date)) {
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

function _isDateValid(str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  if(!regexp.test(str)) return false
  return true
}

function _isYearMonthDateValid(str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])$/
  if(!regexp.test(str)) return false
  return true
}

function _isYearDateValid(str) {
  const regexp = /^[0-9]{4}$/
  if(!regexp.test(str)) return false
  return true
}
