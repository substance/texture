import { forEach } from 'substance'

/*
  <aff> -> Organisation
*/
export const OrganisationConverter = {

  import(el, pubMetaDb) {
    // Use existing record when possible
    let entity = _findOrganisation(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'organisation',
        name: _getText(el, 'institution[content-type=orgname]'),
        division1: _getText(el, 'institution[content-type=orgdiv1]'),
        division2: _getText(el, 'institution[content-type=orgdiv2]'),
        division3: _getText(el, 'institution[content-type=orgdiv3]'),
        street: _getText(el, 'addr-line[content-type=street-address]'),
        addressComplements: _getText(el, 'addr-line[content-type=complements]'),
        city: _getText(el, 'city'),
        state: _getText(el, 'state'),
        postalCode: _getText(el, 'postal-code'),
        country: _getText(el, 'country'),
        phone: _getText(el, 'phone'),
        fax: _getText(el, 'fax'),
        email: _getText(el, 'email'),
        uri: _getText(el, 'uri[content-type=link]')
      }
      entity = pubMetaDb.create(node)
    } else {
      console.warn(`Skipping duplicate: ${entity.name}, ${entity.division1} already exists.`)
    }
    return entity.id
  },

  export($$, node) {
    let el = $$('aff')
    el.append(_createTextElement($$, node.name, 'institution', { 'content-type': 'orgname'}))
    el.append(_createTextElement($$, node.division1, 'institution', { 'content-type': 'orgdiv1'}))
    el.append(_createTextElement($$, node.division2, 'institution', { 'content-type': 'orgdiv2'}))
    el.append(_createTextElement($$, node.division3, 'institution', { 'content-type': 'orgdiv3'}))
    el.append(_createTextElement($$, node.street, 'addr-line', { 'content-type': 'street-address'}))
    el.append(_createTextElement($$, node.addressComplements, 'addr-line', { 'content-type': 'complements'}))
    el.append(_createTextElement($$, node.city, 'city'))
    el.append(_createTextElement($$, node.state, 'state'))
    el.append(_createTextElement($$, node.postalCode, 'postal-code'))
    el.append(_createTextElement($$, node.country, 'country'))
    el.append(_createTextElement($$, node.phone, 'phone'))
    el.append(_createTextElement($$, node.fax, 'fax'))
    el.append(_createTextElement($$, node.email, 'email'))
    el.append(_createTextElement($$, node.uri, 'uri', { 'content-type': 'link'}))
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'uri', {'content-type': 'entity'}))
    return el
  }
}

/*
  <contrib> -> Person

  Used for authors and editors, which may have affiliation etc. assigned
*/
export const PersonConverter = {

  import(el, pubMetaDb) {
    // Use existing record when possible
    let entity = _findPerson(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'person',
        givenNames: _getText(el, 'given-names'),
        surname: _getText(el, 'surname'),
        prefix: _getText(el, 'prefix'),
        suffix: _getText(el, 'suffix'),
        affiliations: []
      }

      let dom = el.ownerDocument
      let xrefs = el.findAll('xref[ref-type=aff]')
      xrefs.forEach(xref => {
        // NOTE: we need to query the document for the internal aff id to
        // access the global entityId for the organisation
        let affEl = dom.find(`#${xref.attr('rid')}`)
        if (affEl) {
          node.affiliations.push(affEl.attr('rid'))
        } else {
          console.warn(`Could not find aff#${xref.attr('rid')} in document`)
        }
      })

      entity = pubMetaDb.create(node)
    } else {
      console.warn(`Skipping duplicate: ${entity.givenNames} ${entity.surname} already exists.`)
    }

    return entity.id
  },

  export($$, node) {
    let el = $$('contrib')
    el.append(
      $$('name').append(
        _createTextElement($$, node.givenNames, 'given-names'),
        _createTextElement($$, node.surname, 'surname'),
        _createTextElement($$, node.prefix, 'prefix'),
        _createTextElement($$, node.suffix, 'suffix')
      )
    )
    let dom = el.ownerDocument
    node.affiliations.forEach(organisationId => {
      // NOTE: we need to query the document for the internal aff record to
      // map from the global entityId to the local affId
      let affEl = dom.find(`aff[rid=${organisationId}]`)
      el.append(
        $$('xref').attr('ref-type', 'aff').attr('rid', affEl.id)
      )
    })
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'contrib-id', {'contrib-id-type': 'entity'}))
    return el
  }
}

/*
  <name> -> Person

  Used within <ref>: <name> elements within <person-group>
*/
export const RefPersonConverter = {

  import(el, pubMetaDb) {
    // Use existing record when possible
    let entity = _findPerson(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'person',
        givenNames: _getText(el, 'given-names'),
        surname: _getText(el, 'surname'),
        prefix: _getText(el, 'prefix'),
        suffix: _getText(el, 'suffix'),
      }
      entity = pubMetaDb.create(node)
    }
    return entity.id
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

/*
  <element-citation publication-type="journal"> -> JournalArticle
*/
export const JournalArticleConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    if (!entity) {
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
        return RefPersonConverter.import(el, pubMetaDb)
      })
      // Extract editors
      node.editors = el.findAll('person-group[person-group-type=editor] > name').map(el => {
        return RefPersonConverter.import(el, pubMetaDb)
      })
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
    let el = $$('element-citation').attr('publication-type', 'journal')
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    el.append(_exportPersonGroup($$, node.editors, 'editor', pubMetaDb))
    // Regular properties
    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createHTMLElement($$, node.articleTitle, 'article-title'))
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.volume, 'volume'))
    el.append(_createTextElement($$, node.fpage, 'fpage'))
    el.append(_createTextElement($$, node.lpage, 'lpage'))
    el.append(_createTextElement($$, node.pageRange, 'page-range'))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'pub-id', {'pub-id-type': 'entity'}))
    return el
  }
}

/*
  <element-citation publication-type="book"> -> Book
*/
export const BookConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'book',
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
        return RefPersonConverter.import(el, pubMetaDb)
      })
      // Extract editors
      node.editors = el.findAll('person-group[person-group-type=editor] > name').map(el => {
        return RefPersonConverter.import(el, pubMetaDb)
      })
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
    let el = $$('element-citation').attr('publication-type', 'book')
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    el.append(_exportPersonGroup($$, node.editors, 'editor', pubMetaDb))
    // Regular properties
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
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'pub-id', {'pub-id-type': 'entity'}))
    return el
  }
}

/*
  <element-citation publication-type="clinicaltrial"> -> Clinical Trial
*/
export const ClinicalTrialConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'clinical-trial',
        articleTitle: _getHTML(el, 'article-title'),
        source: _getText(el, 'source'),
        year: _getText(el, 'year'),
        month: _getText(el, 'month'),
        day: _getText(el, 'day'),
        doi: _getText(el, 'pub-id[pub-id-type=doi]')
      }
      // Extract sponsors
      node.sponsors = el.findAll('person-group[person-group-type=sponsor] > name').map(el => {
        return RefPersonConverter.import(el, pubMetaDb)
      })
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
    let el = $$('element-citation').attr('publication-type', 'clinicaltrial')
    el.append(_exportPersonGroup($$, node.sponsors, 'sponsor', pubMetaDb))
    // Regular properties
    el.append(_createHTMLElement($$, node.articleTitle, 'article-title'))
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'pub-id', {'pub-id-type': 'entity'}))
    return el
  }
}

/*
  <element-citation publication-type="preprint"> -> Preprint
*/
export const PreprintConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'preprint',
        articleTitle: _getHTML(el, 'article-title'),
        source: _getText(el, 'source'),
        year: _getText(el, 'year'),
        month: _getText(el, 'month'),
        day: _getText(el, 'day'),
        doi: _getText(el, 'pub-id[pub-id-type=doi]')
      }
      // Extract authors
      node.authors = el.findAll('person-group[person-group-type=author] > name').map(el => {
        return RefPersonConverter.import(el, pubMetaDb)
      })
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
    let el = $$('element-citation').attr('publication-type', 'journal')
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    // Regular properties
    el.append(_createHTMLElement($$, node.articleTitle, 'article-title'))
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'pub-id', {'pub-id-type': 'entity'}))
    return el
  }
}

/*
  <element-citation publication-type="confproc"> -> Conference Proceeding
*/
export const ConferenceProceedingConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'conference-proceeding',
        articleTitle: _getHTML(el, 'article-title'),
        confName: _getText(el, 'conf-name'),
        source: _getText(el, 'source'),
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
        return RefPersonConverter.import(el, pubMetaDb)
      })
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
    let el = $$('element-citation').attr('publication-type', 'confproc')
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    // Regular properties
    el.append(_createHTMLElement($$, node.chapterTitle, 'article-title'))
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.edition, 'conf-name'))
    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.fpage, 'fpage'))
    el.append(_createTextElement($$, node.lpage, 'lpage'))
    el.append(_createTextElement($$, node.pageRange, 'page-range'))
    el.append(_createTextElement($$, node.elocationId, 'elocation-id'))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'pub-id', {'pub-id-type': 'entity'}))
    return el
  }
}

/*
  <element-citation publication-type="report"> -> Report
*/
export const ReportConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'report',
        source: _getText(el, 'source'),
        publisherLoc: _getText(el, 'publisher-loc'),
        publisherName: _getText(el, 'publisher-name'),
        year: _getText(el, 'year'),
        month: _getText(el, 'month'),
        day: _getText(el, 'day'),
        isbn: _getText(el, 'pub-id[pub-id-type=isbn]')
      }
      // Extract authors
      node.authors = el.findAll('person-group[person-group-type=author] > name').map(el => {
        return RefPersonConverter.import(el, pubMetaDb)
      })
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
    let el = $$('element-citation').attr('publication-type', 'report')
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    // Regular properties
    el.append(_createTextElement($$, node.source, 'source'))
    el.append(_createTextElement($$, node.publisherLoc, 'publisher-loc'))
    el.append(_createTextElement($$, node.publisherName, 'publisher-name'))
    el.append(_createTextElement($$, node.year, 'year'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.isbn, 'pub-id', {'pub-id-type': 'isbn'}))
    // Store entityId for explicit lookup on next import
    el.append(_createTextElement($$, node.id, 'pub-id', {'pub-id-type': 'entity'}))
    return el
  }
}

function _exportPersonGroup($$, persons, personGroupType, pubMetaDb) {
  if (persons > 0) {
    let el = $$('person-group').attr('person-group-type', personGroupType)
    persons.forEach(entityId => {
      let person = pubMetaDb.get(entityId)
      el.append(
        RefPersonConverter.export($$, person)
      )
    })
  }
}

function _findCitation(el, pubMetaDb) {
  let entityId = _getText(el, 'pub-id[pub-id-type=entity]')
  return pubMetaDb.get(entityId)
}

function _findPerson(el, pubMetaDb) {
  let entity = pubMetaDb.get(_getText(el, 'contrib-id[contrib-id-type=entity]'))
  if (!entity) {
    let persons = pubMetaDb.find({ type: 'person' }).map(id => pubMetaDb.get(id))
    let surname = _getText(el, 'surname')
    let givenNames = _getText(el, 'givenNames')
    entity = persons.find(p => {
      return p.surname === surname && p.givenNames === givenNames
    })
  }
  return entity
}

function _findOrganisation(el, pubMetaDb) {
  let entity = pubMetaDb.get(_getText(el, 'uri[content-type=entity]'))
  if (!entity) {
    let organisations = pubMetaDb.find({ type: 'organisation' }).map(id => pubMetaDb.get(id))
    let name = _getText(el, 'institution[content-type=orgname]')
    let division1 = _getText(el, 'institution[content-type=orgdiv1]')
    entity = organisations.find(o => {
      return o.name === name && o.division1 === division1
    })
  }
  return entity
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
