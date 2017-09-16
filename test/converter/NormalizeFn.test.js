import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import NormalizeFn from '../../src/converter/j2r/NormalizeFn'

const test = module('Footnote Normalize Transformer')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('fn-group.xml')

test("j2r: Transform paragraphs inside fn", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)

  let fn = dom.find('#fn3')
  let paragraphs = fn.findAll('p')
  t.equal(paragraphs.length, 2, 'fn should contain two paragraphs')
  t.equal(paragraphs[0].textContent, 'paragraph 1', 'first paragraph should be "paragraph 1"')
  t.equal(paragraphs[1].textContent, 'paragraph 2', 'second paragraph should be "paragraph 2"')

  t.end()
})

test("j2r: Removing elements during fn transformation", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)

  let fn = dom.find('#fn3')
  t.equal(fn.children.length, 2, 'fn should contain two elements')
  t.notOk(fn.find('fig'), 'there should be no fig element left inside fn')
  t.notOk(fn.find('label'), 'there should be no label element left inside fn')
  t.notOk(fn.find('caption'), 'there should be no caption element left inside fn')
  t.notOk(fn.find('title'), 'there should be no title element left inside fn')
  t.notOk(fn.find('graphic'), 'there should be no graphic element left inside fn')
  t.ok(fn.find('p'), 'there should be p element left inside fn')

  t.end()
})
