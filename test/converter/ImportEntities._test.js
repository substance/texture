import { test } from 'substance-test'
import { DefaultDOMElement, Configurator } from 'substance'
import { EntitiesPackage, ImportEntities } from '../../index'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('element-citation.xml')

test('ImportEntities: Import journal citation', function (t) {
  let { entityDb } = _setupImportTest()

  // TODO: how can we turn the original id into a uuid, what to do
  // with the old id?, and how to find the record after its id has changed?
  let r1 = entityDb.get('r1')

  t.equal(r1.authors.length, 2, 'should be two authors')
  t.equal(r1.editors.length, 1, 'should be one editor')
  t.equal(r1.year, '2009', 'year should be equal')
  t.equal(r1.articleTitle, 'Journal article title', 'articleTitle should be equal')
  t.equal(r1.source, 'Journal article source', 'source should be equal')
  t.equal(r1.volume, '29', 'volume should be equal')
  t.equal(r1.fpage, '6436', 'fpage should be equal')
  t.equal(r1.lpage, '6448', 'lpage should be equal')
  t.equal(r1.pageRange, '6436-6448', 'pageRange should be equal')
  t.equal(r1.elocationId, 'ELOCID', 'elocationId should be equal')
  t.equal(r1.doi, '10.1523/JNEUROSCI.5479-08.2009', 'doi should be equal')

  t.end()
})

test('ImportEntities: Import book citation', function (t) {
  let { entityDb } = _setupImportTest()
  let r2 = entityDb.get('r2')

  t.equal(r2.authors.length, 1, 'should be one author')
  t.equal(r2.editors.length, 1, 'should be one editor')
  t.equal(r2.chapterTitle, 'Tobacco use', 'chapterTitle should be equal')
  t.equal(r2.source, 'Clinical methods: the history, physical, and laboratory examinations', 'source should be equal')
  t.equal(r2.publisherLoc, 'Stoneham (MA)', 'publisherLoc should be equal')
  t.equal(r2.publisherName, 'Butterworth Publishers', 'publisherName should be equal')
  t.equal(r2.year, '1990', 'year should be equal')
  t.equal(r2.month, '10', 'month should be equal')
  t.equal(r2.day, '5', 'day should be equal')
  t.equal(r2.fpage, '214', 'fpage should be equal')
  t.equal(r2.lpage, '216', 'lpage should be equal')
  t.equal(r2.pageRange, '214-216', 'pageRange should be equal')
  t.equal(r2.elocationId, 'ELOCID', 'elocationId should be equal')

  t.end()
})

test('ImportEntities: Extract persons from element citation', function (t) {
  let { entityDb } = _setupImportTest()
  const r1 = entityDb.get('r1')
  const authors = r1.authors

  t.equal(authors.length, 2, 'should be two authors')
  const author1 = entityDb.get(authors[0])
  t.equal(author1.surname, 'Doe', 'surname should be equal')
  t.equal(author1.givenNames, 'John', 'givenNames should be equal')
  t.isNil(author1.prefix, 'prefix should be equal')
  t.isNil(author1.suffix, 'suffix should be equal')

  const author2 = entityDb.get(authors[1])
  t.equal(author2.surname, 'Doe', 'surname should be equal')
  t.equal(author2.givenNames, 'Jane', 'givenNames should be equal')
  t.equal(author2.prefix, 'Dr', 'prefix should be equal')
  t.equal(author2.suffix, 'Jr', 'suffix should be equal')

  t.end()
})

test('ImportEntities: Export journal citation', function (t) {
  let { dom } = _setupExportTest()

  let r1 = dom.find('#r1')
  t.ok(r1, 'r1 ref should exists')
  t.equal(r1.findAll('element-citation').length, 1, 'should be one element-citation')
  t.equal(r1.find('element-citation').attr('publication-type'), 'journal', 'publication-type should be journal')
  t.equal(r1.findAll('person-group').length, 2, 'should be two person-groups')
  t.equal(r1.findAll('person-group')[0].attr('person-group-type'), 'author', 'person-group-type of first person-group should be author')
  t.equal(r1.findAll('person-group')[1].attr('person-group-type'), 'editor', 'person-group-type of second person-group should be editor')
  t.equal(r1.find('article-title').text(), 'Journal article title', 'article-title should be equal')
  t.equal(r1.find('source').text(), 'Journal article source', 'source should be equal')
  t.equal(r1.find('year').text(), '2009', 'year should be equal')
  t.equal(r1.find('year').attr('iso-8601-date'), '2009', 'iso-8601-date of year should be equal')
  t.equal(r1.find('volume').text(), '29', 'volume should be equal')
  t.equal(r1.find('fpage').text(), '6436', 'fpage should be equal')
  t.equal(r1.find('lpage').text(), '6448', 'lpage should be equal')
  t.equal(r1.find('page-range').text(), '6436-6448', 'page-range should be equal')
  t.equal(r1.find('elocation-id').text(), 'ELOCID', 'elocation-id should be equal')
  t.equal(r1.find('pub-id').attr('pub-id-type'), 'doi', 'pub-id-type of pub-id should be equal')
  t.equal(r1.find('pub-id').text(), '10.1523/JNEUROSCI.5479-08.2009', 'pub-id should be equal')

  t.end()
})

test('ImportEntities: Export book citation', function (t) {
  let { dom } = _setupExportTest()

  let r2 = dom.find('#r2')
  t.ok(r2, 'r2 ref should exists')
  t.equal(r2.findAll('element-citation').length, 1, 'should be one element-citation')
  t.equal(r2.find('element-citation').attr('publication-type'), 'book', 'publication-type should be book')
  t.equal(r2.findAll('person-group').length, 2, 'should be two person-groups')
  t.equal(r2.findAll('person-group')[0].attr('person-group-type'), 'author', 'person-group-type of first person-group should be author')
  t.equal(r2.findAll('person-group')[1].attr('person-group-type'), 'editor', 'person-group-type of second person-group should be editor')
  t.equal(r2.find('chapter-title').text(), 'Tobacco use', 'chapter-title should be equal')
  t.equal(r2.find('source').text(), 'Clinical methods: the history, physical, and laboratory examinations', 'source should be equal')
  t.equal(r2.find('publisher-loc').text(), 'Stoneham (MA)', 'publisher-loc should be equal')
  t.equal(r2.find('publisher-name').text(), 'Butterworth Publishers', 'publisher-name should be equal')
  t.equal(r2.find('year').text(), '1990', 'year should be equal')
  t.equal(r2.find('year').attr('iso-8601-date'), '1990', 'iso-8601-date of year should be equal')
  t.equal(r2.find('month').text(), '10', 'month should be equal')
  t.equal(r2.find('day').text(), '5', 'day should be equal')
  t.equal(r2.find('fpage').text(), '214', 'fpage should be equal')
  t.equal(r2.find('lpage').text(), '216', 'lpage should be equal')
  t.equal(r2.find('page-range').text(), '214-216', 'page-range should be equal')
  t.equal(r2.find('elocation-id').text(), 'ELOCID', 'elocation-id should be equal')

  t.end()
})

test('ImportEntities: Export person entities to element citations', function (t) {
  let { dom } = _setupExportTest()

  const r1 = dom.find('#r1')
  t.ok(r1, 'r1 ref should exists')
  t.equal(r1.findAll('person-group').length, 2, 'should be two person-groups')

  const PersonGroupFirst = r1.findAll('person-group')[0]
  t.equal(PersonGroupFirst.attr('person-group-type'), 'author', 'person-group-type of first person-group should be author')
  t.equal(PersonGroupFirst.findAll('name').length, 2, 'should be two names inside first person-group')
  const AuthorFirst = PersonGroupFirst.findAll('name')[0]
  t.equal(AuthorFirst.find('surname').text(), 'Doe', 'surname should be equal')
  t.equal(AuthorFirst.find('given-names').text(), 'John', 'given-names should be equal')
  t.isNil(AuthorFirst.find('prefix'), 'prefix should not exist')
  t.isNil(AuthorFirst.find('suffix'), 'suffix should not exist')
  const AuthorSecond = PersonGroupFirst.findAll('name')[1]
  t.equal(AuthorSecond.find('surname').text(), 'Doe', 'surname should be equal')
  t.equal(AuthorSecond.find('given-names').text(), 'Jane', 'given-names should be equal')
  t.equal(AuthorSecond.find('prefix').text(), 'Dr', 'prefix should be equal')
  t.equal(AuthorSecond.find('suffix').text(), 'Jr', 'suffix should be equal')

  const PersonGroupSecond = r1.findAll('person-group')[1]
  t.equal(PersonGroupSecond.attr('person-group-type'), 'editor', 'person-group-type of second person-group should be editor')
  t.equal(PersonGroupSecond.findAll('name').length, 1, 'should be one name inside second person-group')

  t.end()
})

function _emptyEntityDb () {
  // creating an in-memory model of the EntityDB
  // which will be used to create records from JATS
  let entitiesConf = new Configurator()
  entitiesConf.import(EntitiesPackage)
  return entitiesConf.createDocument()
}

// By storing the errors we can later check for an error count in failing
// tests.
function _createAPI (entityDb) {
  let errors = []
  return {
    entityDb,
    error: function (data) {
      errors.push(data)
    }
  }
}

// Import entities from XML, used in the beginning of each test
function _setupImportTest () {
  let entityDb = _emptyEntityDb()
  let dom = DefaultDOMElement.parseXML(fixture)
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)

  return { converter, dom, entityDb }
}

function _setupExportTest () {
  let entityDb = _emptyEntityDb()
  let dom = DefaultDOMElement.parseXML(fixture)
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)
  converter.export(dom, api)

  return { converter, dom, entityDb }
}
