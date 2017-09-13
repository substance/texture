import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import FnGroupConverter from '../../src/converter/r2t/FnGroupConverter'

const test = module('Footnote Group Converter')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('fn-group.xml')
let noFnGroupFixture = readFixture('no-fn-group.xml')

test("r2t: Import document without fn-group", function(t) {
  let dom = DefaultDOMElement.parseXML(noFnGroupFixture)
  let converter = new FnGroupConverter()
  converter.import(dom)

  let fnGroup = dom.find('fn-group')
  t.ok(fnGroup, 'should be one fn-group')
  t.equal(fnGroup.children.length, 0, 'fn-group should be empty')

  t.end()
})

test("r2t: Import document with fn-group", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new FnGroupConverter()
  converter.import(dom)

  let fnGroup = dom.find('fn-group')
  t.ok(fnGroup, 'should be one fn-group')
  t.ok(fnGroup.children.length > 0, 'fn-group should be non empty')

  t.end()
})

test("r2t: Export empty fn-group", function(t) {
  let dom = DefaultDOMElement.parseXML(noFnGroupFixture)
  let converter = new FnGroupConverter()
  converter.import(dom)
  converter.export(dom)

  let fnGroup = dom.find('fn-group')
  t.notOk(fnGroup, 'should be no fn-group')

  t.end()
})

test("r2t: Export not empty fn-group", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new FnGroupConverter()
  converter.import(dom)
  converter.export(dom)

  let fnGroup = dom.find('fn-group')
  t.ok(fnGroup, 'should be fn-group')

  t.end()
})