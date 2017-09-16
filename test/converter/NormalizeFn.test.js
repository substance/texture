import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import NormalizeFn from '../../src/converter/j2r/NormalizeFn'

const test = module('Footnote Normalize Transformer')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('fn-group.xml')

test("j2r: Transform fn", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)

  let fn3 = dom.find('#fn3')
  let fn3paragraphs = fn3.findAll('p')
  let fn3dispQuote = fn3.find('disp-quote')

  t.equal(fn3.children.length, 1, 'fn should contain one element')
  t.notOk(fn3dispQuote, 'fn should not contain any disp-quote')
  t.equal(fn3paragraphs.length, 1, 'fn should contain one paragraph')
  t.equal(fn3paragraphs[0].textContent, 'paragraph 1', 'first paragraph should be "paragraph 1"')

  let fn4 = dom.find('#fn4')
  let fn4paragraphs = fn4.findAll('p')
  t.equal(fn4.children.length, 2, 'fn should contain two elements')
  t.equal(fn4paragraphs.length, 2, 'fn should contain two paragraphs')
  t.equal(fn4paragraphs[0].textContent, 'paragraph 1', 'first paragraph should be "paragraph 1"')
  t.equal(fn4paragraphs[1].textContent, 'paragraph 2', 'second paragraph should be "paragraph 2"')

  t.end()
})
