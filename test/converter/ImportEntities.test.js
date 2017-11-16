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
  let { dom } = _setupExportTest()

  let r1 = dom.find('#r1')
  t.ok(r1)
  t.equal(r1.findAll('element-citation').length, 1)
  t.equal(r1.find('element-citation').attr('publication-type'), 'journal')
  t.equal(r1.findAll('person-group').length, 2)
  t.equal(r1.findAll('person-group')[0].attr('person-group-type'), 'author')
  t.equal(r1.findAll('person-group')[1].attr('person-group-type'), 'editor')
  t.equal(r1.find('article-title').text(), 'Journal article title')
  t.equal(r1.find('source').text(), 'Journal article source')
  t.equal(r1.find('year').text(), '2009')
  t.equal(r1.find('year').attr('iso-8601-date'), '2009')
  t.equal(r1.find('volume').text(), '29')
  t.equal(r1.find('fpage').text(), '6436')
  t.equal(r1.find('lpage').text(), '6448')
  t.equal(r1.find('page-range').text(), '6436-6448')
  t.equal(r1.find('elocation-id').text(), 'ELOCID')
  t.equal(r1.find('pub-id').attr('pub-id-type'), 'doi')
  t.equal(r1.find('pub-id').text(), '10.1523/JNEUROSCI.5479-08.2009')

  t.end()
})

test("Export book citation", function(t) {
  let { dom } = _setupExportTest()

  let r2 = dom.find('#r2')
  t.ok(r2)
  t.equal(r2.findAll('element-citation').length, 1)
  t.equal(r2.find('element-citation').attr('publication-type'), 'book')
  t.equal(r2.findAll('person-group').length, 2)
  t.equal(r2.findAll('person-group')[0].attr('person-group-type'), 'author')
  t.equal(r2.findAll('person-group')[1].attr('person-group-type'), 'editor')
  t.equal(r2.find('chapter-title').text(), 'Tobacco use')
  t.equal(r2.find('source').text(), 'Clinical methods: the history, physical, and laboratory examinations')
  t.equal(r2.find('publisher-loc').text(), 'Stoneham (MA)')
  t.equal(r2.find('publisher-name').text(), 'Butterworth Publishers')
  t.equal(r2.find('year').text(), '1990')
  t.equal(r2.find('year').attr('iso-8601-date'), '1990')
  t.equal(r2.find('month').text(), '10')
  t.equal(r2.find('day').text(), '5')
  t.equal(r2.find('fpage').text(), '214')
  t.equal(r2.find('lpage').text(), '216')
  t.equal(r2.find('page-range').text(), '214-216')
  t.equal(r2.find('elocation-id').text(), 'ELOCID')

  t.end()
})

test("Export person entities to element citations", function(t) {
  let { dom } = _setupExportTest()

  const r1 = dom.find('#r1')
  t.ok(r1)
  t.equal(r1.findAll('person-group').length, 2)

  const PersonGroupFirst = r1.findAll('person-group')[0]
  t.equal(PersonGroupFirst.attr('person-group-type'), 'author')
  t.equal(PersonGroupFirst.findAll('name').length, 2)
  const AuthorFirst = PersonGroupFirst.findAll('name')[0]
  t.equal(AuthorFirst.find('surname').text(), 'Doe')
  t.equal(AuthorFirst.find('given-names').text(), 'John')
  t.isNil(AuthorFirst.find('prefix'))
  t.isNil(AuthorFirst.find('suffix'))
  const AuthorSecond = PersonGroupFirst.findAll('name')[1]
  t.equal(AuthorSecond.find('surname').text(), 'Doe')
  t.equal(AuthorSecond.find('given-names').text(), 'Jane')
  t.equal(AuthorSecond.find('prefix').text(), 'Dr')
  t.equal(AuthorSecond.find('suffix').text(), 'Jr')

  const PersonGroupSecond = r1.findAll('person-group')[1]
  t.equal(PersonGroupSecond.attr('person-group-type'), 'editor')
  t.equal(PersonGroupSecond.findAll('name').length, 1)

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
