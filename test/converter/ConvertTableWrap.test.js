import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import ConvertFig from '../../src/converter/r2t/ConvertTableWrap'

const test = module('Convert TableWrap')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('table.xml')

test("r2t: Should convert table-wrap without caption", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#tbl1')
  // title should now be child of fig, and caption a container of paragraphs
  t.equal(fn.outerHTML, '<table-wrap id="tbl1"><object-id pub-id-type="doi"/><title/><caption><p/></caption><table/></table-wrap>')
  t.end()
})
