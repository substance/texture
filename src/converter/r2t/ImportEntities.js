const TYPES = {
  'journal': 'journal-citation',
  'book': 'book-citation'
}

const ELEMENT_CITATION_ENTITY_DB_MAP = {
  'articleTitle': 'article-title',
  'chapterTitle': 'chapter-title',
  'source': 'source',
  'publisherLoc': 'publisher-loc',
  'publisherName': 'publisher-name',
  'volume': 'volume',
  'year': 'year',
  'month': 'month',
  'day': 'day',
  'fpage': 'fpage',
  'lpage': 'lpage',
  'pageRange': 'page-range',
  'elocationId': 'elocation-id',
  'doi': 'pub-id'
}

export default class ImportEntities {
  /*
    During import we are extracting persons and then walk through
    entity schema to pull properties out of element-citation
    At the end we are cleaning ref elements and changing xref rids
    to ids of newly created entities

    > Note: we might need to think about id-disambiguation here,
      i.e. making sure that the local entities do not collide
      with existing ones (regarding id)... maybe it is a good
      idea not to rely on local ids at all, i.e. always convert
      local ids into global ones, where we can choose ids
      which are propability->zero to collide
  */
  import(dom, api) {
    let refs = dom.findAll('ref')

    const entityDb = api.entityDb
    refs.forEach((refEl) => {
      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error('Could not find <element-citation>')
      } else {
        const entityId = _createBibliographicEntity(elementCitation, entityDb)
        if(entityId) {
          const bibRefs = dom.findAll('xref[ref-type=bibr][rid=' + refEl.id + ']')
          bibRefs.forEach(bibRef => {
            bibRef.attr('rid', entityId)
          })
        }
      }
      // make the DOM element just a shallow pointer
      // TODO: we might need to check if the id of the ref
      // is actually unique w.r.t. the global entity-db
      // and change the id if necessary including all refs.
      // But for now we just continue with the id from JATS
      refEl.empty()
    })
  }

  export(dom, api) {
    const entityDb = api.entityDb
    const entities = entityDb.getNodes()
    const entityIds = Object.keys(entities)

    let refList = dom.find('ref-list')

    entityIds.forEach(entityId => {
      const entity = entities[entityId].toJSON()
      const ref = _createRefElement({dom, entity, entityDb})
      if(ref) refList.append(ref)
    })
  }
}

function _createBibliographicEntity(elementCitation, entityDb) {
  let pubType = elementCitation.attr('publication-type')

  if (!pubType) throw new Error('element-citation[publication-type] is mandatory')
  // TODO: support the different pub-types and create
  // related entities as well (e.g. for authors)
  let type = TYPES[pubType]
  if(!type) {
    console.error('TODO: implement entity importer for', pubType, 'entity type')
    return
  }
  // Extract authors and editors from element-citation
  const persons = _extractPersons(elementCitation, entityDb)
  let record = {
    id: elementCitation.getParent().id,
    type,
    authors: persons.author,
    editors: persons.editor
  }

  // Extract all other attributes for a certain pub-type
  // and populate entity record
  const nodes = _getEntityNodes(type, entityDb)
  nodes.forEach(node => {
    const prop = _getElementCitationProperty(node, elementCitation)
    if(prop) record[node] = prop
  })
  // Create record
  const entity = entityDb.create(record)

  return entity.id
}

// Creating ref element from given entity record
function _createRefElement({dom, entity, entityDb}) {
  // We don't want to convert person entities to XML
  // we want to create name element for each person reference
  if(entity.type === 'person') return

  const pubType = Object.keys(TYPES).find(type => {
    return TYPES[type] === entity.type
  })

  if(!pubType) {
    console.error('TODO: implement entity exporter for', entity.type, 'entity type')
    return
  }

  let ref = dom.createElement('ref').attr('id', entity.id)
  let elementCitation = dom.createElement('element-citation').attr('publication-type', pubType)

  Object.keys(ELEMENT_CITATION_ENTITY_DB_MAP).forEach(prop => {
    const value = entity[prop]
    const elName = ELEMENT_CITATION_ENTITY_DB_MAP[prop]
    if(value) {
      let el = dom.createElement(elName).append(value)

      if(elName === 'year') {
        el.attr('iso-8601-date', value)
      } else if(elName === 'pub-id') {
        el.attr('pub-id-type', 'doi')
      }

      elementCitation.append(el)
    }
  })

  _injectPersons({elementCitation, entity, entityDb})

  ref.append(elementCitation)
  return ref
}

// Extract persons from element citation, create entites
// and returns their ids grouped by person type
function _extractPersons(elementCitation, entityDb) {
  let result = {
    author: [],
    editor: []
  }

  const personGroups = elementCitation.findAll('person-group')
  personGroups.forEach(group => {
    const type = group.attr('person-group-type')
    const persons = group.findAll('name')
    persons.forEach(person => {
      let record = {
        type: 'person'
      }
      const surname = person.find('surname')
      if(surname) record.surname = surname.text()
      const givenNames = person.find('given-names')
      if(givenNames) record.givenNames = givenNames.text()
      const suffix = person.find('suffix')
      if(suffix) record.suffix = suffix.text()
      const prefix = person.find('prefix')
      if(prefix) record.prefix = prefix.text()

      const entity = entityDb.create(record)
      if(result[type]) result[type].push(entity.id)
    })
  })

  return result
}

// Injecting person-groups to element-citation
// persons pulled out from entityDb
function _injectPersons({elementCitation, entity, entityDb}) {
  const authors = entity.authors
  const authorsEl = elementCitation.createElement('person-group')
    .attr('person-group-type', 'authors')

  authors.forEach(author => {
    authorsEl.append(_createNameElement(authorsEl, entityDb.get(author).toJSON()))
  })

  const editors = entity.editors
  const editorsEl = elementCitation.createElement('person-group')
    .attr('person-group-type', 'editors')

  editors.forEach(editor => {
    editorsEl.append(_createNameElement(editorsEl, entityDb.get(editor).toJSON()))
  })

  elementCitation.append(
    authorsEl,
    editorsEl
  )
}

// Create name element with person populated from entity
function _createNameElement(el, person) {
  let nameEl = el.createElement('name')
  Object.keys(person).forEach(prop => {
    if(prop !== 'id' && prop !== 'type') {
      nameEl.append(
        el.createElement(prop).append(person[prop])
      )
    }
  })
  return nameEl
}

/* HELPERS */

// Returns list of entity properties
function _getEntityNodes(type, entityDb) {
  const entityDbSchema = entityDb.getSchema()
  const nodeClass = entityDbSchema.getNodeClass(type)
  return Object.keys(nodeClass.schema)
}

// Get child property value of element-citation
function _getElementCitationProperty(prop, elementCitation) {
  let result
  const xmlProp = ELEMENT_CITATION_ENTITY_DB_MAP[prop]
  if(xmlProp) {
    const propEl = elementCitation.find(xmlProp)
    if(propEl) result = propEl.text()
  }

  return result
}
