import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { ConvertTableWrap } from '../../index'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('table.xml')

test('ConvertTableWrap: table-wrap without caption', function (t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertTableWrap()
  converter.import(dom)
  let fn = dom.find('#tbl1')
  // title should now be child of fig, and caption a container of paragraphs
  t.equal(fn.outerHTML, '<table-wrap id="tbl1"><object-id pub-id-type="doi"/><title/><caption><p/></caption><table/></table-wrap>')
  t.end()
})
