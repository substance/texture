import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'

// TODO: export all trafos via index.es.js, and import {..} from '../../index.es.js'
import ConvertCodeCell from '../../src/converter/r2t/ConvertCodeCell'
const test = module('Convert Code Cell')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('reproducible-jats.xml')

test("r2t: Import cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  let cell = dom.find('#cell1')
  t.equal(cell.tagName, 'cell')
  let sourceCode = cell.find('source-code')
  t.equal(sourceCode.textContent, 'x=5')
  t.equal(sourceCode.attr('language'), 'python')

  let output = cell.find('output')
  t.equal(output.textContent, '{}')
  t.equal(output.attr('language'), 'json')
  t.end()
})

test("r2t: Export cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)
  let cell = dom.find('#cell1')
  t.equal(cell.tagName, 'code')
  let sourceCode = cell.find('named-content > alternatives > code[specific-use=source]')
  t.equal(sourceCode.textContent, 'x=5')
  t.equal(sourceCode.attr('language'), 'python')

  let output = cell.find('named-content > alternatives > code[specific-use=output]')
  t.equal(output.textContent, '{}')
  t.equal(output.attr('language'), 'json')
  t.end()
})
