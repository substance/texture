import { module } from 'substance-test'
import {
 DefaultDOMElement, Configurator
} from 'substance'
import { EntitiesPackage, ImportEntities } from 'substance-texture'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('element-citation.xml')

const test = module('ImportEntities')

test("Import journal citation", function(t) {
  let { entityDb } = _setupImportTest()

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

test("Import book citation", function(t) {
  let { entityDb } = _setupImportTest()
  let r2 = entityDb.get('r2')

  t.equal(r2.authors.length, 1)
  t.equal(r2.editors.length, 1)
  t.equal(r2.chapterTitle, 'Tobacco use')
  t.equal(r2.source, 'Clinical methods: the history, physical, and laboratory examinations')
  t.equal(r2.publisherLoc, 'Stoneham (MA)')
  t.equal(r2.publisherName, 'Butterworth Publishers')
  t.equal(r2.year, '1990')
  t.equal(r2.month, '10')
  t.equal(r2.day, '5')
  t.equal(r2.fpage, '214')
  t.equal(r2.lpage, '216')
  t.equal(r2.pageRange, '214-216')
  t.equal(r2.elocationId, 'ELOCID')

  t.end()
})

test("Extract persons from element citation", function(t) {
  let { entityDb } = _setupImportTest()
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

test("Export journal citation", function(t) {
  let { entityDb } = _setupExportTest()

  let r1 = entityDb.get('r1')

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
function _createAPI(entityDb) {
  let errors = []
  return {
    entityDb,
    error: function(data) {
      errors.push(data)
    }
  }
}

// Import entities from XML, used in the beginning of each test
function _setupImportTest() {
  let entityDb = _emptyEntityDb()
  let dom = DefaultDOMElement.parseXML(fixture)
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)

  return { converter, dom, entityDb }
}

function _setupExportTest() {
  let entityDb = _emptyEntityDb()
  let dom = DefaultDOMElement.parseXML(fixture)
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)
  converter.export(dom, api)

  return { converter, dom, entityDb }
}
