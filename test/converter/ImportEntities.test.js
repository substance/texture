import { module } from 'substance-test'
import {
 DefaultDOMElement, Configurator
} from 'substance'

// TODO: export all trafos via index.es.js, and import {..} from '../../index.es.js'
import ImportEntities from '../../src/converter/r2t/ImportEntities'
import { EntitiesPackage } from '../../src/entities'
import readFixture from '../fixture/readFixture'

const test = module('Import Entities')
const fixture = readFixture('element-citation.xml')


test("Import journal citation", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let entityDb = _emptyEntityDb()
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)

  // TODO: how can we turn the original id into a uuid, what to do
  // with the old id?, and how to find the record after its id has changed?
  let r1 = entityDb.get('r1')

  t.equal(r1.authors.length, 2)
  t.equal(r1.editors.length, 1)
  t.equal(r1.year, '2009')
  t.equal(r1.articleTitle, 'Journal article title')
  t.equal(r1.source, 'Journal article source')
  t.equal(r1.volume, '29')
  t.equal(r1.fpage, '6436')
  t.equal(r1.lpage, '6448')
  t.equal(r1.pageRange, '6436-6448')
  t.equal(r1.elocationId, 'ELOCID')
  t.equal(r1.doi, '10.1523/JNEUROSCI.5479-08.2009')

  t.end()
})

test("Extract persons from element citation", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let entityDb = _emptyEntityDb()
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)

  const r1 = entityDb.get('r1')
  const authors = r1.authors
  t.equal(authors.length, 2)
  const author1 = entityDb.get(authors[0])
  t.equal(author1.surname, 'Doe')
  t.equal(author1.givenNames, 'John')
  t.isNil(author1.prefix)
  t.isNil(author1.suffix)

  const author2 = entityDb.get(authors[1])
  t.equal(author2.surname, 'Doe')
  t.equal(author2.givenNames, 'Jane')
  t.equal(author2.prefix, 'Dr')
  t.equal(author2.suffix, 'Jr')

  t.end()
})

function _emptyEntityDb() {
  // creating an in-memory model of the EntityDB
  // which will be used to create records from JATS
  let entitiesConf = new Configurator()
  entitiesConf.import(EntitiesPackage)
  return entitiesConf.createDocument()
}

// By storing the errors we can later check for an error count in failing
// tests.
function _createAPI(entityDB) {
  let errors = []
  return {
    entityDB,
    error: function(data) {
      errors.push(data)
    }
  }
}
