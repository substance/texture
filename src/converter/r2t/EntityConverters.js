import { forEach } from 'substance'

/*
  Used within <ref>: <name> elements within <person-group>
*/
export const RefPersonConverter = {

  import(el, entityDb) {
    // Use existing record when possible
    let entityId = _findPerson(el, entityDb)
    if (!entityId) {
      let node = {
        type: 'person',
        givenNames: _getText(el, 'given-names'),
        surname: _getText(el, 'surname'),
        prefix: _getText(el, 'prefix'),
        suffix: _getText(el, 'suffix'),
      }
      entityId = entityDb.create(node).id
    }
    return entityId
  },

  export($$, node) {
    let el = $$('name')
    el.append(_createTextElement($$, node.givenNames, 'given-names'))
    el.append(_createTextElement($$, node.surname, 'surname'))
    el.append(_createTextElement($$, node.prefix, 'prefix'))
    el.append(_createTextElement($$, node.suffix, 'suffix'))
    return el
  }
}

export const JournalArticleConverter = {

  import(el, entityDb) {
    let entityId = _findCitation(el)
    if (!entityId) {
      let node = {
        type: 'journal-article',
        articleTitle: _getHTML(el, 'article-title'),
        source: _getText(el, 'source'),
        volume: _getText(el, 'volume'),
        issue: _getText(el, 'issue'),
        year: _getText(el, 'year'),
        month: _getText(el, 'month'),
        day: _getText(el, 'day'),
        fpage: _getText(el, 'fpage'),
        lpage: _getText(el, 'lpage'),
        pageRange: _getText(el, 'page-range'),
        elocationId: _getText(el, 'elocation-id'),
        doi: _getText(el, 'pub-id[pub-id-type=doi]')
      }
      // Extract authors
      node.authors = el.findAll('person-group[person-group-type=author] > name').map(el => {
        return RefPersonConverter.import(el, entityDb)
      })
      // Extract editors
      node.editors = el.findAll('person-group[person-group-type=editor] > name').map(el => {
        return RefPersonConverter.import(el, entityDb)
      })
      entityId = entityDb.create(node).id
    }
    return entityId
  },

  export($$, node, entityDb) {
    let el = $$('element-citation').attr('publication-type', 'journal')
    el.append(_exportPersonGroup($$, node.authors, 'author', entityDb))
    el.append(_exportPersonGroup($$, node.editors, 'editor', entityDb))

    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createHTMLElement($$, node.articleTitle, 'article-title'))
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.volume, 'volume'))
    el.append(_createTextElement($$, node.fpage, 'fpage'))
    el.append(_createTextElement($$, node.lpage, 'lpage'))
    el.append(_createTextElement($$, node.pageRange, 'page-range'))
    return el
  }
}

export const BookConverter = {

  import(el, entityDb) {
    let entityId = _findCitation(el)
    if (!entityId) {
      let node = {
        type: 'journal-article',
        chapterTitle: _getHTML(el, 'chapter-title'),
        source: _getText(el, 'source'),
        edition: _getText(el, 'edition'),
        publisherLoc: _getText(el, 'publisher-loc'),
        publisherName: _getText(el, 'publisher-name'),
        year: _getText(el, 'year'),
        month: _getText(el, 'month'),
        day: _getText(el, 'day'),
        fpage: _getText(el, 'fpage'),
        lpage: _getText(el, 'lpage'),
        pageRange: _getText(el, 'page-range'),
        pageCount: _getText(el, 'page-count'),
        elocationId: _getText(el, 'elocation-id'),
        doi: _getText(el, 'pub-id[pub-id-type=doi]'),
        pmid: _getText(el, 'pub-id[pub-id-type=pmid]'),
        isbn: _getText(el, 'pub-id[pub-id-type=isbn]')
      }
      // Extract authors
      node.authors = el.findAll('person-group[person-group-type=author] > name').map(el => {
        return RefPersonConverter.import(el, entityDb)
      })
      // Extract editors
      node.editors = el.findAll('person-group[person-group-type=editor] > name').map(el => {
        return RefPersonConverter.import(el, entityDb)
      })
      entityId = entityDb.create(node).id
    }
    return entityId
  },

  export($$, node, entityDb) {
    let el = $$('element-citation').attr('publication-type', 'journal')
    el.append(_exportPersonGroup($$, node.authors, 'author', entityDb))
    el.append(_exportPersonGroup($$, node.editors, 'editor', entityDb))

    el.append(_createHTMLElement($$, node.chapterTitle, 'chapter-title'))
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.edition, 'edition'))
    el.append(_createTextElement($$, node.publisherLoc, 'publisher-loc'))
    el.append(_createTextElement($$, node.publisherName, 'publisher-name'))
    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.fpage, 'fpage'))
    el.append(_createTextElement($$, node.lpage, 'lpage'))
    el.append(_createTextElement($$, node.pageRange, 'page-range'))
    el.append(_createTextElement($$, node.pageCount, 'page-count'))
    el.append(_createTextElement($$, node.elocationId, 'elocation-id'))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    el.append(_createTextElement($$, node.isbn, 'pub-id', {'pub-id-type': 'isbn'}))
    el.append(_createTextElement($$, node.pmid, 'pub-id', {'pub-id-type': 'pmid'}))
    return el
  }
}

function _exportPersonGroup($$, persons, personGroupType, entityDb) {
  if (persons > 0) {
    let el = $$('person-group').attr('person-group-type', personGroupType)
    persons.forEach(entityId => {
      let person = entityDb.get(entityId)
      el.append(
        RefPersonConverter.export($$, person)
      )
    })
  }
}

function _findCitation(el) {
  return _getText(el, 'pub-id[pub-id-type=entity]')
}

function _findPerson(el, entityDb) {
  let personIds = entityDb.find({ type: 'person' })
  let surname = _getText(el, 'surname')
  let givenNames = _getText(el, 'givenNames')
  let entityId = personIds.find(personId => {
    let person = entityDb.get(personId)
    return person.surname === surname && person.givenNames === givenNames
  })
  return entityId
}

function _getText(rootEl, selector) {
  let match = rootEl.find(selector)
  if (match) {
    return match.textContent
  } else {
    return ''
  }
}

function _getHTML(rootEl, selector) {
  let match = rootEl.find(selector)
  if (match) {
    return match.innerHTML
  } else {
    return ''
  }
}

function _createTextElement($$, text, tagName, attrs) {
  if (text) {
    let el = $$(tagName).append(text)
    forEach(attrs, (value, key) => {
      el.attr(key, value)
    })
    return el
  }
}

function _createHTMLElement($$, html, tagName, attrs) {
  if (html) {
    let el = $$(tagName)
    el.innerHTML = html
    forEach(attrs, (value, key) => {
      el.attr(key, value)
    })
    return el
  }
}
