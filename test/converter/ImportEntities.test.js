import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
// TODO: export all trafos via index.es.js, and import {..} from '../../index.es.js'
import ImportEntities from '../../src/converter/r2t/ImportEntities'
const test = module('Import Entities')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('element-citation.xml')

function _emptyEntityDb() {
  // TODO: Create an empty entity db
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


test("r2t: Import journal citation", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let entityDb = _emptyEntityDb()
  let api = _createAPI(entityDb)
  let converter = new ImportEntities()

  converter.import(dom, api)

  // TODO: how can we turn the original id into a uuid, what to do
  // with the old id?, and how to find the record after its id has changed?
  let r1 = entityDb.get('r1')

  t.equal(r1.authors.length, 1)
  t.equal(r1.authors.length, 1)
  // TODO: should we check for the actual person records every time in each test
  // or better create a separate unit test only for person extraction?
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
