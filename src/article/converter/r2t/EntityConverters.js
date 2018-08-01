import { forEach } from 'substance'

/*
  <aff> -> Organisation
*/
export const OrganisationConverter = {

  import(el, pubMetaDb) {    
    let node = {
      id,
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
    entity = pubMetaDb.create(node)
    return entity.id
  },

  export($$, node) {
    let el = $$('aff').attr('id', node.id)
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
    return el
  }
}

/*
  <award-group> -> Award

  <!--
    Used for modelling award:

  <award-group id="fund1">
    <funding-source>
      <institution-wrap>
        <institution-id institution-id-type="FundRef">https://dx.doi.org/10.13039/100000011</institution-id>
        <institution>Howard Hughes Medical Institute</institution>
      </institution-wrap>
    </funding-source>
    <award-id>F32 GM089018</award-id>
  </award-group>
  -->
*/
export const AwardConverter = {

  import(el, pubMetaDb) {
    let node = {
      id: el.id,
      type: 'award',
      institution: getText(el, 'institution'),
      fundRefId: getText(el, 'institution-id'),
      awardId: getText(el, 'award-id')
    }
    let entity = pubMetaDb.create(node)
    return entity.id
  },

  export($$, node) {
    let el = $$('award-group').attr('id', node.id)

    let institutionWrapEl = $$('institution-wrap')
    institutionWrapEl.append(_createTextElement($$, node.fundRefId, 'institution-id', { 'institution-id-type': 'FundRef'}))
    institutionWrapEl.append(_createTextElement($$, node.institution, 'institution'))

    el.append(
      $$('funding-source').append(institutionWrapEl),
      _createTextElement($$, node.awardId, 'award-id')
    )
    return el
  }
}

/*
  <kwd> -> Keyword
*/
export const KeywordConverter = {

  import(el, pubMetaDb) {
    const node = {
      type: 'keyword',
      name: el.textContent,
      category: el.getAttribute('content-type'),
      language: el.getParent().getAttribute('xml:lang')
    }
    const entity = pubMetaDb.create(node)

    return entity.id
  },

  export($$, node) {
    return _createTextElement($$, node.name, 'kwd', {'content-type': node.category})
  }
}

/*
  <subject> -> Subject
*/
export const SubjectConverter = {

  import(el, pubMetaDb) {
    const node = {
      // HACK: trying to merge EntitDb into Article model, avoiding type collision
      type: '_subject',
      name: el.textContent,
      category: el.getAttribute('content-type'),
      language: el.getParent().getAttribute('xml:lang')
    }
    const entity = pubMetaDb.create(node)
    return entity.id
  },

  export($$, node) {
    return _createTextElement($$, node.name, 'subject', { 'content-type': node.category })
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
    let node = {
      type: 'group',
      name: getText(el, 'named-content[content-type=name]'),
      email: getText(el, 'email'),
      affiliations: _extractAffiliations(el, true),
      equalContrib: el.getAttribute('equal-contrib') === 'yes',
      corresp: el.getAttribute('corresp') === 'yes',
      awards: _extractAwards(el)
    }
    entity = pubMetaDb.create(node)

    let dom = el.ownerDocument
    let persons = _extractGroupMembers(el, entity.id)
    persons.forEach(person => {
      const personNode = pubMetaDb.create(person)
      const contribEl = dom.createElement('contrib').attr({
        'rid': personNode.id,
        'gid': node.id,
        'contrib-type': 'person'
      })
      const authorsContribGroup = dom.find('contrib-group[content-type=author]')
      authorsContribGroup.append(contribEl)
    })
    return entity.id
  },

  export($$, node) {
    let el = $$('contrib').attr({
      'id': node.id,
      'contrib-type': 'group',
      'equal-contrib': node.equalContrib ? 'yes' : 'no',
      'corresp': node.corresp ? 'yes' : 'no'
    })
    let collab = $$('collab')
    collab.append(
      $$('named-content').attr('content-type', 'name').append(node.name),
      $$('email').append(node.email)
    )
    // Adds affiliations to group
    _addAffiliations(collab, $$, node)
    // Add awards to group
    _addAwards(collab, $$, node)
    //_addGroupMembers(collab, $$, node)
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
    let entity = pubMetaDb.create(
      _extractPerson(el)
    )
    return entity.id
  },

  export($$, node) {
    let el = _exportPerson($$, node)
    // Adds affiliations to el
    _addAffiliations(el, $$, node)
    // Adds awards to el
    _addAwards(el, $$, node)
    return el
  }
}

function _exportPerson($$, node) {
  let el = $$('contrib').attr({
    'contrib-type': 'person',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    'corresp': node.corresp ? 'yes' : 'no',
    'deceased': node.deceased ? 'yes' : 'no'
  })

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
  node.affiliations.forEach(organisationId => {
    el.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', organisationId)
    )
  })
}

function _addAwards(el, $$, node) {
  let dom = el.ownerDocument
  node.awards.forEach(awardId => {
    el.append(
      $$('xref').attr('ref-type', 'award').attr('rid', awardId)
    )
  })
}

/*
  <name> -> { type: 'ref-contrib', name: 'Doe', givenNames: 'John }
  <collab>  -> { type: 'ref-contrib' name: 'International Business Machines' }

  Used within <ref>
*/
export const RefContribConverter = {

  import(el, pubMetaDb) {
    let node
    if (el.tagName === 'name') {
      node = {
        type: 'ref-contrib',
        givenNames: getText(el, 'given-names'),
        name: getText(el, 'surname')// ,
        // TODO: We may want to consider prefix postfix, and mix it into givenNames, or name properties
        // We don't want separate fields because this gets complex/annoying during editing
        // prefix: getText(el, 'prefix'),
        // suffix: getText(el, 'suffix'),
      }
    } else if (el.tagName === 'collab') {
      node = {
        type: 'ref-contrib',
        name: getText(el, 'named-content[content-type=name]')
      }
    } else {
      console.warn(`${el.tagName} not supported inside <person-group>`)
    }

    let entity = pubMetaDb.create(node)
    return entity.id
  },

  export($$, node) {
    let el
    if (node.givenNames) {
      el = $$('name')
      el.append(_createTextElement($$, node.name, 'surname'))
      el.append(_createTextElement($$, node.givenNames, 'given-names'))
      // el.append(_createTextElement($$, record.prefix, 'prefix'))
      // el.append(_createTextElement($$, record.suffix, 'suffix'))
    } else if (node.name) {
      el = $$('collab')
      el.append(_createTextElement($$, node.name, 'named-content', { 'content-type': 'name' }))
    } else {
      console.warn('No content found for refContrib node')
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
  // HACK: trying to merge EntitDb into Article model, avoiding type collision
  'patent': '_patent',
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

  import(el, pubMetaDb, id) {
    let entity = _findCitation(el, pubMetaDb)
    let type = el.attr('publication-type')

    if (!entity) {
      let node = {
        // HACK: trying to merge EntitDb into Article model, avoiding id collision
        id: `@${id}`,
        type: mappingItemTypes[type],
        // normal fields
        assignee: getText(el, 'collab[collab-type=assignee] > named-content'),
        confName: getText(el, 'conf-name'),
        confLoc: getText(el, 'conf-loc'),
        day: getText(el, 'day'),
        edition: getText(el, 'edition'),
        elocationId: getText(el, 'elocation-id'),
        fpage: getText(el, 'fpage'),
        issue: getText(el, 'issue'),
        lpage: getText(el, 'lpage'),
        month: getText(el, 'month'),
        pageCount: getText(el, 'page-count'),
        pageRange: getText(el, 'page-range'),
        partTitle: getText(el, 'part-title'),
        patentCountry: _getAttr(el, 'patent', 'country'),
        patentNumber: getText(el, 'patent'),
        publisherLoc: _getSeparatedText(el, 'publisher-loc'),
        publisherName: _getSeparatedText(el, 'publisher-name'),
        series: getText(el, 'series'),
        uri: getText(el, 'uri'),
        version: getText(el, 'version'),
        volume: getText(el, 'volume'),
        year: getText(el, 'year'),
        // identifiers
        accessionId: getText(el, 'pub-id[pub-id-type=accession]'),
        archiveId: getText(el, 'pub-id[pub-id-type=archive]'),
        arkId: getText(el, 'pub-id[pub-id-type=ark]'),
        isbn: getText(el, 'pub-id[pub-id-type=isbn]'),
        doi: getText(el, 'pub-id[pub-id-type=doi]'),
        pmid: getText(el, 'pub-id[pub-id-type=pmid]')
      }
      if (type === 'book' || type === 'report' || type === 'software') {
        node.title = getText(el, 'source')
      } else {
        node.containerTitle = getText(el, 'source')
        if (type === 'chapter') {
          node.title = _getHTML(el, 'chapter-title')
        } else if (type === 'data') {
          node.title = _getHTML(el, 'data-title')
        } else {
          node.title = _getHTML(el, 'article-title')
        }
      }

      node.authors = _getRefContribs(el, pubMetaDb, 'author')
      node.editors = _getRefContribs(el, pubMetaDb, 'editor')
      node.inventors = _getRefContribs(el, pubMetaDb, 'inventor')
      node.sponsors = _getRefContribs(el, pubMetaDb, 'sponsor')
      node.translators = _getRefContribs(el, pubMetaDb, 'translator')
      entity = pubMetaDb.create(node)
    }
    return entity.id
  },

  export($$, node, pubMetaDb) {
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
    el.append(_exportPersonGroup($$, node.authors, 'author', pubMetaDb))
    el.append(_exportPersonGroup($$, node.editors, 'editor', pubMetaDb))
    el.append(_exportPersonGroup($$, node.inventors, 'inventor', pubMetaDb))
    el.append(_exportPersonGroup($$, node.sponsors, 'sponsor', pubMetaDb))

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

function _exportPersonGroup($$, contribs, personGroupType, pubMetaDb) {
  if (contribs && contribs.length > 0) {
    let el = $$('person-group').attr('person-group-type', personGroupType)
    contribs.forEach(refContribId => {
      let refContribNode = pubMetaDb.get(refContribId)
      el.append(
        RefContribConverter.export($$, refContribNode)
      )
    })
    return el
  }
}

function _extractPerson(el, group) {
  return {
    type: 'person',
    givenNames: getText(el, 'given-names'),
    surname: getText(el, 'surname'),
    email: getText(el, 'email'),
    prefix: getText(el, 'prefix'),
    suffix: getText(el, 'suffix'),
    group: group,
    affiliations: _extractAffiliations(el),
    awards: _extractAwards(el),
    equalContrib: el.getAttribute('equal-contrib') === 'yes',
    corresp: el.getAttribute('corresp') === 'yes',
    deceased: el.getAttribute('deceased') === 'yes'
  }
}

function _getRefContribs(el, pubMetaDb, type) {
  let personGroup = el.find(`person-group[person-group-type=${type}]`)
  if (personGroup) {
    return personGroup.childNodes.map(el => {
      return RefContribConverter.import(el, pubMetaDb)
    })
  } else {
    return []
  }
}

function _extractGroupMembers(el, group) {
  let members = el.findAll('contrib')
  return members.map(el => {
    return _extractPerson(el, group)
  })
}

function _extractAffiliations(el, isGroup) {
  // let dom = el.ownerDocument
  let xrefs = el.findAll('xref[ref-type=aff]')
  // NOTE: for groups we need to extract only affiliations of group, without members
  if (isGroup) {
    xrefs = el.findAll('collab > xref[ref-type=aff]')
  }

  let affs = xrefs.map(xref => xref.attr('rid'))
  return affs
}

function _extractAwards(el) {
  let dom = el.ownerDocument
  let xrefs = el.findAll('xref[ref-type=award]')
  let awardIds = xrefs.map(xref => xref.attr('rid'))
  return awardIds
}


function _findCitation(el, pubMetaDb) {
  let entityId = getText(el, 'pub-id[pub-id-type=entity]')
  return pubMetaDb.get(entityId)
}


export function getText(rootEl, selector) {
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
