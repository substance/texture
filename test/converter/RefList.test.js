import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { RefList } from '../../index'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('ref-list.xml')
const emptyBackFixture = readFixture('empty-back.xml')

test("RefList: Import document without ref-list", function(t) {
  let dom = DefaultDOMElement.parseXML(emptyBackFixture)
  let converter = new RefList()
  converter.import(dom)

  let refList = dom.find('ref-list')
  t.ok(refList, 'should be one ref-list')
  t.equal(refList.children.length, 0, 'ref-list should not have children')

  t.end()
})

test("RefList: Cleaning up existing ref-list", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new RefList()
  converter.import(dom)

  let refList = dom.find('ref-list')
  let title = refList.find('title')
  let label = refList.find('label')
  let refs = refList.findAll('ref')
  t.ok(refList, 'ref-list should exists')
  t.notOk(title, 'there shoud not be title inside ref-list')
  t.notOk(label, 'there shoud not be label inside ref-list')
  t.equal(refs.length, 1, 'there should be one ref inside ref-list')

  t.end()
})
