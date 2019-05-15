import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { FnGroupConverter } from 'substance-texture'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('fn-group.xml')
const noFnGroupFixture = readFixture('empty-back.xml')

test('FnGroupConverter: Import document without fn-group', function (t) {
  let dom = DefaultDOMElement.parseXML(noFnGroupFixture)
  let converter = new FnGroupConverter()
  converter.import(dom)

  let fnGroup = dom.find('fn-group')
  t.ok(fnGroup, 'should be one fn-group')
  t.equal(fnGroup.children.length, 0, 'fn-group should be empty')

  t.end()
})

test('FnGroupConverter: Import document with fn-group', function (t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new FnGroupConverter()
  converter.import(dom)

  let fnGroup = dom.find('fn-group')
  t.ok(fnGroup, 'should be one fn-group')
  t.ok(fnGroup.children.length > 0, 'fn-group should be non empty')

  let xTags = fnGroup.find('x')
  t.notOk(xTags, 'should be no x tags inside fn-group')

  t.end()
})

test('FnGroupConverter: Export empty fn-group', function (t) {
  let dom = DefaultDOMElement.parseXML(noFnGroupFixture)
  let converter = new FnGroupConverter()
  converter.import(dom)
  converter.export(dom)

  let fnGroup = dom.find('fn-group')
  t.notOk(fnGroup, 'should be no fn-group')

  t.end()
})

test('FnGroupConverter: Export not empty fn-group', function (t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new FnGroupConverter()
  converter.import(dom)
  converter.export(dom)

  let fnGroup = dom.find('fn-group')
  t.ok(fnGroup, 'should be fn-group')

  t.end()
})
