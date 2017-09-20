import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import EmptyRefListTransformer from '../../src/converter/j2r/EmptyRefList'

const test = module('Footnote Group Converter')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('empty-back.xml')

test("j2r: Import document without ref-list", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new EmptyRefListTransformer()
  converter.import(dom)

  let refList = dom.find('ref-list')
  let title = refList.find('title')
  t.ok(refList, 'should be one ref-list')
  t.equal(refList.children.length, 1, 'ref-list should have only one child')
  t.ok(title, 'should be title inside ref-list')

  t.end()
})
