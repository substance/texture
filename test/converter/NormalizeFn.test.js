import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { NormalizeFn } from 'substance-texture'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('fn-group.xml')

const test = module('NormalizeFn')

test("Unwrap fn > p > disp-quote > p", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)
  let fn = dom.find('#fn3')
  t.equal(fn.outerHTML, '<fn id="fn3"><p>disp_<bold>quote</bold></p></fn>')
  t.end()
})

test("Removing all elements except inner p's", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new NormalizeFn()
  converter.import(dom)
  let fn = dom.find('#fn4')
  t.equal(fn.outerHTML, '<fn id="fn4"><p>fig_caption</p></fn>')
  t.end()
})
