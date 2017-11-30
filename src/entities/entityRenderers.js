import { DefaultDOMElement } from 'substance'

// ${authors}. ${editors}. ${year}. ${article-title}. ${source} <strong>${vol}</strong>:${fpage}-${lpage}.
function journalArticleRenderer($$, entityId, entityDb) {
  let entity = entityDb.get(entityId)
  let fragments = []
  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb)
    )
  }
  if (entity.editors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.editors, entityDb)
    )
  }
  // We render an annotated article title here:
  fragments.push(
    _renderHTML($$, entity.articleTitle)
  )
  fragments.push('. ', entity.source)
  if (entity.volume) {
    fragments.push(
      ' ',
      $$('strong').append(
        entity.volume
      )
    )
  }
  if (entity.fpage && entity.lpage) {
    fragments.push(':', entity.fpage, '-', entity.lpage)
  }
  return fragments
}

// ${source} (${edition}). ${authors}. [ ${editors}, editors.] (${year}) ${publisher-loc}: ${publisher}.
function bookRenderer($$, entityId, entityDb) {
  let entity = entityDb.get(entityId)
  let fragments = []

  // We render an annotated chapter title here:
  fragments.push(
    _renderHTML($$, entity.chapterTitle)
  )
  fragments.push('. ', entity.source)
  if (entity.edition) {
    fragments.push(' (', entity.edition, ').')
  }
  if (entity.authors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.authors, entityDb)
    )
  }
  if (entity.editors.length > 0) {
    fragments = fragments.concat(
      _renderAuthors($$, entity.editors, entityDb)
    )
  }
  return fragments
}

function personRenderer($$, entityId, entityDb) {
  let { prefix, suffix, givenNames, surname } = entityDb.get(entityId)
  let result = []

  if (prefix) {
    result.push(prefix, ' ')
  }
  result.push(givenNames, ' ', surname)
  if (suffix) {
    result.push(' (', suffix, ')')
  }
  return result
}

function organisationRenderer($$, entityId, entityDb) {
  let { name } = entityDb.get(entityId)
  return [
    name
  ]
}

const INTERNAL_RENDERER_MAP = {
  'organisation': organisationRenderer,
  'person': personRenderer
}

/*
  Exports
*/
export default {
  'person': _delegate(personRenderer),
  'book': _delegate(bookRenderer),
  'journal-article': _delegate(journalArticleRenderer),
  'organisation': _delegate(organisationRenderer)
}

/*
  Helpers
*/
function _renderAuthors($$, entityIds, entityDb) {
  let fragments = [' ']
  entityIds.forEach((entityId, i) => {
    fragments = fragments.concat(
      _delegateEntityRenderer($$, entityId, entityDb)
    )
    if (i < entityIds.length - 1) {
      fragments.push(', ')
    }
  })
  fragments.push('.')
  return fragments
}

function _delegateEntityRenderer($$, entityId, entityDb) {
  let entity = entityDb.get(entityId)
  return INTERNAL_RENDERER_MAP[entity.type]($$, entityId, entityDb)
}

function _renderHTML($$, htmlString) {
  return $$('span').html(htmlString)
}

function _delegate(fn) {
  return function(entityId, db) {
    let el = _createElement()
    let $$ = el.createElement.bind(el)
    let fragments = fn($$, entityId, db)
    el.append(fragments)
    return el.innerHTML
  }
}


function _createElement() {
  return DefaultDOMElement.parseSnippet('<div>', 'html')
}
