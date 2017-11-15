import { ELEMENT_CITATION_ENTITY_DB_MAP } from '../../constants'

/*
  @daniel: this is just a sketch. Could not try it out as
  it is all so preliminary.
  Just a pointer how to start :)

  Mission:
  Create entitites for references found in the JATS file
  and remove them from the DOM.

  - Turn JATS ref-lists into a flat version with 'shallow' refs
    <ref-list>
      <title>Bibliografía</title>
      <ref id="B1" />
    </ref-list>
  - create entities from the content of the refs

  > Note: we might need to think about id-disambiguation here,
    i.e. making sure that the local entities do not collide
    with existing ones (regarding id)... maybe it is a good
    idea not to rely on local ids at all, i.e. always convert
    local ids into global ones, where we can choose ids
    which are propability->zero to collide
*/
export default class ImportEntities {

  import(dom, api) {
    // let bibs = dom.findAll()
    // let bibRefs = dom.findAll('xref[ref-type=bibr]')
    let refs = dom.findAll('ref')

    const entityDB = api.entityDB
    refs.forEach((refEl) => {
      let refContent = refEl.children

      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error('Could not find <element-citation>')
      } else {
        const entityId = _createBibliographicEntity(elementCitation, entityDB)
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

  export(dom) {
    // TODO: serialize out the refs
  }
}

const TYPES = {
  'journal': 'journal-citation',
  'book': 'book-citation'
}

function _createBibliographicEntity(elementCitation, entityDB) {
  let pubType = elementCitation.attr('publication-type')

  if (!pubType) throw new Error('element-citation[publication-type] is mandatory')
  // TODO: support the different pub-types and create
  // related entities as well (e.g. for authors)
  let type = TYPES[pubType]
  if(!type) {
    console.error('TODO: implement entity importer for', pubType, 'entity type')
    return
  }
  const persons = _extractPersons(elementCitation, entityDB)
  let record = {
    type,
    authors: persons.author,
    editors: persons.editor
  }

  const schema = _getEntitySchema(type, entityDB)
  const nodes = Object.keys(schema)

  nodes.forEach(node => {
    const prop = _getCitationProperty(node, elementCitation)
    if(prop) record[node] = prop
  })

  const entity = entityDB.create(record)

  return entity.id
}

// Extract persons from element citation, create entites
// and returns their ids grouped by person type
function _extractPersons(elementCitation, entityDB) {
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

      const entity = entityDB.create(record)
      if(result[type]) result[type].push(entity.id)
    })
  })

  return result
}

function _getEntitySchema(type, entityDB) {
  const entityDBSchema = entityDB.getSchema()
  const nodeClass = entityDBSchema.getNodeClass(type)
  return nodeClass.schema
}

function _getCitationProperty(prop, elementCitation) {
  let result
  const xmlProp = ELEMENT_CITATION_ENTITY_DB_MAP[prop]
  if(xmlProp) {
    const propEl = elementCitation.find(xmlProp)
    if(propEl) result = propEl.text()
  }

  return result
}
