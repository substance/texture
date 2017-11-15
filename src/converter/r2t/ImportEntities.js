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
    let bibs = dom.findAll()
    let bibRefs = dom.findAll('xref[ref-type=bibr]')
    let refs = dom.findAll('ref')

    const entityDB = api.entityDB
    refs.forEach((refEl) => {
      let refContent = refEl.children

      let elementCitation = refEl.find('element-citation')
      if (!elementCitation) {
        api.error('Could not find <element-citation>')
      } else {
        _createBibliographicEntity(elementCitation, entityDB)
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
  entityDB.create({
    type,
    // << add more data here
  })
}
