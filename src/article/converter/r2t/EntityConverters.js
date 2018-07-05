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
    // el.append(_createTextElement($$, node.id, 'uri', {'content-type': 'entity'}))
    return el
  }
}


/*
  <contrib contrib-type='group'> -> Group

  Used for group authors

  <!--
    Used for modelling group authors:

  <contrib contrib-type="group" equal-contrib="yes" corresp="no" deceased="no">
    <collab>
      <named-content content-type="name">The Mouse Genome Sequencing Consortium</named-content>
      <xref ref-type="aff" rid="aff2"/>
      <xref ref-type="award" rid="fund1" />
      <contrib-group contrib-type="group-member">
        <contrib contrib-type="person">
          <name>
            <surname>Kelly</surname><given-names>Laura A.</given-names>
          </name>
          <role>Writing Group</role>
          <xref ref-type="aff" rid="aff2"/>
        </contrib>
        <contrib contrib-type="person">
          <name>
            <surname>Randall</surname><given-names>Daniel Lee</given-names>
            <suffix>Jr.</suffix>
          </name>
          <role>Lab Group</role>
          <xref ref-type="aff" rid="aff3"/>
        </contrib>
      </contrib-group>
    </collab>
  </contrib>
  -->
*/

export const GroupConverter = {

  import(el, pubMetaDb) {
    // Use existing record when possible
    let entity = _findPerson(el, pubMetaDb)
    if (!entity) {
      let node = {
        type: 'group',
        name: _getText(el, 'named-content[content-type=name]'),
        email: _getText(el, 'email'),
        affiliations: _extractAffiliations(el),
        members: _extractGroupMembers(el)
      }
      entity = pubMetaDb.create(node)
    } else {
      console.warn(`Skipping duplicate: ${entity.name} already exists.`)
    }
    return entity.id
  },

  export($$, node) {
    let el = $$('contrib').attr('contrib-type', 'group')
    let collab = $$('collab')
    collab.append(
      $$('named-content').attr('content-type', 'name').append(node.name),
      $$('email').append(node.email)
    )
    // Adds affiliations to group
    _addAffiliations(collab, $$, node)
    _addGroupMembers(collab, $$, node)
    el.append(collab)
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
      entity = pubMetaDb.create(
        _extractPerson(el)
      )
    } else {
      console.warn(`Skipping duplicate: ${entity.givenNames} ${entity.surname} already exists.`)
    }

    return entity.id
  },

  export($$, node) {
    let el = _exportPerson($$, node)
    // Adds affiliations to el
    _addAffiliations(el, $$, node)
    return el
  }
}


function _exportPerson($$, node) {
  let el = $$('contrib').attr('contrib-type', 'person')
  el.append(
    $$('name').append(
      _createTextElement($$, node.surname, 'surname'),
      _createTextElement($$, node.givenNames, 'given-names'),
      _createTextElement($$, node.prefix, 'prefix'),
      _createTextElement($$, node.suffix, 'suffix')
    ),
    _createTextElement($$, node.email, 'email')
  )
  return el
}

function _addAffiliations(el, $$, node) {
  let dom = el.ownerDocument
  node.affiliations.forEach(organisationId => {
    // NOTE: we need to query the document for the internal aff record to
    // map from the global entityId to the local affId
    let affEl = dom.find(`aff[rid=${organisationId}]`)
    el.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', affEl.id)
    )
  })
}

/*
  <name> -> { type: 'person', ... }
  <collab>  -> { type: 'group' } 

  Used within <ref>
*/
export const RefCollabConverter = {

  import(el) {
    let entry
    if (el.tagName === 'name') {
      entry = {
        type: 'person',
        givenNames: _getText(el, 'given-names'),
        surname: _getText(el, 'surname'),
        prefix: _getText(el, 'prefix'),
        suffix: _getText(el, 'suffix'),
      }
    } else if (el.tagName === 'collab') {
      entry = {
        type: 'group',
        name: _getText(el, 'named-content[content-type=name]')
      }
    } else {
      console.warn(`${el.tagName} not supported inside <person-group>`)
    }
    return entry
  },

  export($$, record) {
    let el
    if (record.type === 'person') {
      el = $$('name')
      el.append(_createTextElement($$, record.surname, 'surname'))
      el.append(_createTextElement($$, record.givenNames, 'given-names'))
      el.append(_createTextElement($$, record.prefix, 'prefix'))
      el.append(_createTextElement($$, record.suffix, 'suffix'))
    } else if (record.type === 'collab') {
      el = $$('collab')
      el.append(_createTextElement($$, record.name, 'named-content', { 'content-type': 'name' }))
    }
    return el
  }
}


let mappingItemTypes = {
  'journal': 'journal-article',
  'book': 'book',
  'chapter': 'chapter',
  'confproc': 'conference-paper',
  'data': 'data-publication',
  'patent': 'patent',
  'magazine': 'magazine-article',
  'newspaper': 'newspaper-article',
  'report': 'report',
  'software': 'software',
  'thesis': 'thesis',
  'webpage': 'webpage'
}

// reverse key-value-pairs in a mapping to value-key-pairs
// (Assume: one-to-one-mapping)
let reverseMapping = function(mapping) {
  let reverseMapping = {}
  for (let key in mapping) {
    if (mapping.hasOwnProperty(key)) {
      reverseMapping[mapping[key]] = key
    }
  }
  return reverseMapping
}

/*
  <element-citation ...>
*/
export const ElementCitationConverter = {

  import(el, pubMetaDb) {
    let entity = _findCitation(el, pubMetaDb)
    let type = el.attr('publication-type')
    if (!entity) {
      let node = {
        type: mappingItemTypes[type],
        // normal fields
        assignee: _getText(el, 'collab[collab-type=assignee] > named-content'),
        confName: _getText(el, 'conf-name'),
        confLoc: _getText(el, 'conf-loc'),
        day: _getText(el, 'day'),
        edition: _getText(el, 'edition'),
        elocationId: _getText(el, 'elocation-id'),
        fpage: _getText(el, 'fpage'),
        issue: _getText(el, 'issue'),
        lpage: _getText(el, 'lpage'),
        month: _getText(el, 'month'),
        pageCount: _getText(el, 'page-count'),
        pageRange: _getText(el, 'page-range'),
        partTitle: _getText(el, 'part-title'),
        patentCountry: _getAttr(el, 'patent', 'country'),
        patentNumber: _getText(el, 'patent'),
        publisherLoc: _getSeparatedText(el, 'publisher-loc'),
        publisherName: _getSeparatedText(el, 'publisher-name'),
        series: _getText(el, 'series'),
        uri: _getText(el, 'uri'),
        version: _getText(el, 'version'),
        volume: _getText(el, 'volume'),
        year: _getText(el, 'year'),
        // identifiers
        accessionId: _getText(el, 'pub-id[pub-id-type=accession]'),
        archiveId: _getText(el, 'pub-id[pub-id-type=archive]'),
        arkId: _getText(el, 'pub-id[pub-id-type=ark]'),
        isbn: _getText(el, 'pub-id[pub-id-type=isbn]'),
        doi: _getText(el, 'pub-id[pub-id-type=doi]'),
        pmid: _getText(el, 'pub-id[pub-id-type=pmid]')
      }
      if (type === 'book' || type === 'report' || type === 'software') {
        node.title = _getText(el, 'source')
      } else {
        node.containerTitle = _getText(el, 'source')
        if (type === 'chapter') {
          node.title = _getHTML(el, 'chapter-title')
        } else if (type === 'data') {
          node.title = _getHTML(el, 'data-title')
        } else {
          node.title = _getHTML(el, 'article-title')
        }
      }

      node.authors = _getRefCollabs(el, pubMetaDb, 'author')
      node.editors = _getRefCollabs(el, pubMetaDb, 'editor')
      node.inventors = _getRefCollabs(el, pubMetaDb, 'inventor')
      node.sponsors = _getRefCollabs(el, pubMetaDb, 'sponsor')
      node.translators = _getRefCollabs(el, pubMetaDb, 'translator')
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node) {
    let type = node.type
    let el = $$('element-citation').attr('publication-type', reverseMapping(mappingItemTypes)[type])

    // Regular properties
    if (node.assignee) {
      el.append(
        $$('collab').append(
          _createTextElement($$, node.assignee, 'named-content', {'content-type': 'name'})
        )
      )
    }

    el.append(_createTextElement($$, node.confName, 'conf-name'))
    el.append(_createTextElement($$, node.confLoc, 'conf-loc'))
    el.append(_createTextElement($$, node.day, 'day'))
    el.append(_createTextElement($$, node.edition, 'edition'))
    el.append(_createTextElement($$, node.elocationId, 'elocation-id'))
    el.append(_createTextElement($$, node.fpage, 'fpage'))
    el.append(_createTextElement($$, node.issue, 'issue'))
    el.append(_createTextElement($$, node.lpage, 'lpage'))
    el.append(_createTextElement($$, node.month, 'month'))
    el.append(_createTextElement($$, node.pageCount, 'page-count'))
    el.append(_createTextElement($$, node.pageRange, 'page-range'))
    el.append(_createTextElement($$, node.partTitle, 'part-title'))
    el.append(_createTextElement($$, node.patentNumber, 'patent', { 'country': node.patentCountry }))
    el.append(_createMultipleTextElements($$, node.publisherLoc, 'publisher-loc'))
    el.append(_createMultipleTextElements($$, node.publisherName, 'publisher-name'))
    el.append(_createTextElement($$, node.uri, 'uri'))
    el.append(_createTextElement($$, node.version, 'version'))
    el.append(_createTextElement($$, node.volume, 'volume'))
    el.append(_createTextElement($$, node.year, 'year'))
    // identifiers
    el.append(_createTextElement($$, node.accessionId, 'pub-id', {'pub-id-type': 'accession'}))
    el.append(_createTextElement($$, node.arkId, 'pub-id', {'pub-id-type': 'ark'}))
    el.append(_createTextElement($$, node.archiveId, 'pub-id', {'pub-id-type': 'archive'}))
    el.append(_createTextElement($$, node.isbn, 'pub-id', {'pub-id-type': 'isbn'}))
    el.append(_createTextElement($$, node.doi, 'pub-id', {'pub-id-type': 'doi'}))
    el.append(_createTextElement($$, node.pmid, 'pub-id', {'pub-id-type': 'pmid'}))
    // creators
    el.append(_exportPersonGroup($$, node.authors, 'author'))
    el.append(_exportPersonGroup($$, node.editors, 'editor'))
    el.append(_exportPersonGroup($$, node.inventors, 'inventor'))
    el.append(_exportPersonGroup($$, node.sponsors, 'sponsor'))

    if (type === 'book' || type === 'report' || type === 'software') {
      el.append(_createTextElement($$, node.title, 'source'))
    } else {
      el.append(_createTextElement($$, node.containerTitle, 'source'))
      if (type === 'chapter') {
        el.append(_createHTMLElement($$, node.title, 'chapter-title'))
      } else if (type === 'data') {
        el.append(_createHTMLElement($$, node.title, 'data-title'))
      } else {
        el.append(_createHTMLElement($$, node.title, 'article-title'))
      }
    }
    return el
  }
}


function _exportPersonGroup($$, persons, personGroupType) {
  if (persons && persons.length > 0) {
    let el = $$('person-group').attr('person-group-type', personGroupType)
    persons.forEach(entry => {
      el.append(
        RefCollabConverter.export($$, entry)
      )
    })
    return el
  }
}

function _extractPerson(el) {
  return {
    type: 'person',
    givenNames: _getText(el, 'given-names'),
    surname: _getText(el, 'surname'),
    email: _getText(el, 'email'),
    prefix: _getText(el, 'prefix'),
    suffix: _getText(el, 'suffix'),
    affiliations: _extractAffiliations(el)
  }
}

function _getRefCollabs(el, pubMetaDb, type) {
  let personGroup = el.find(`person-group[person-group-type=${type}]`)
  if (personGroup) {
    return personGroup.childNodes.map(el => {
      return RefCollabConverter.import(el, pubMetaDb)
    })
  } else {
    return []
  }
}

function _extractGroupMembers(el) {
  let members = el.findAll('contrib')
  return members.map(el => {
    return _extractPerson(el)
  })
}

function _addGroupMembers(el, $$, node) {
  let contribGroup = $$('contrib-group').attr('contrib-type', 'group-member')
  node.members.forEach(member => {
    contribGroup.append(
      _exportPerson($$, member)
    )
  })
  el.append(contribGroup)
}

function _extractAffiliations(el) {
  let dom = el.ownerDocument
  let xrefs = el.findAll('xref[ref-type=aff]')
  let affs = []
  xrefs.forEach(xref => {
    // NOTE: we need to query the document for the internal aff id to
    // access the global entityId for the organisation
    let affEl = dom.find(`#${xref.attr('rid')}`)
    if (affEl) {
      affs.push(affEl.attr('rid'))
    } else {
      console.warn(`Could not find aff#${xref.attr('rid')} in document`)
    }
  })
  return affs
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
    let givenNames = _getText(el, 'given-names')
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

function _getSeparatedText(rootEl, selector) {
  let match = rootEl.findAll(selector)
  if (match) {
    return match.map(m => { return m.textContent }).join('; ')
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

function _getAttr(rootEl, selector, attr) {
  let match = rootEl.find(selector)
  if (match) {
    return match.attr(attr)
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

function _createMultipleTextElements($$, text, tagName, attrs) {
  if (text) {
    const textItems = text.split(';')
    const elements = textItems.map(ti => {
      const el = $$(tagName).append(ti.trim())
      forEach(attrs, (value, key) => {
        el.attr(key, value)
      })
      return el
    })
    return elements
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
