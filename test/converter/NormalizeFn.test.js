import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import NormalizeFn from '../../src/converter/j2r/NormalizeFn'

const test = module('Footnote Normalize Transformer')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('fn-group.xml')

test("j2r: Unwrap fn > p > disp-quote > p", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)
  let fn = dom.find('#fn3')
  t.equal(fn.outerHTML, '<fn id="fn3"><p>disp_<bold>quote</bold></p></fn>')
  t.end()
})

test("j2r: Removing all elements except inner p's", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)
  let fn = dom.find('#fn4')
  t.equal(fn.outerHTML, '<fn id="fn4"><p>fig_caption</p></fn>')
  t.end()
})
