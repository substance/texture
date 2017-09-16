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

  let fn = dom.find('#fn4')
  let paragraphs = fn.findAll('p')
  t.equal(fn.children.length, 2, 'fn should contain two elements')
  t.equal(paragraphs.length, 2, 'fn should contain two paragraphs')
  t.equal(paragraphs[0].textContent, 'paragraph 1', 'first paragraph should be "paragraph 1"')
  t.equal(paragraphs[1].textContent, 'paragraph 2', 'second paragraph should be "paragraph 2"')

  t.end()
})
