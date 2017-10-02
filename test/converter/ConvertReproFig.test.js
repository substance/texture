import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'

import ConvertReproFig from '../../src/converter/r2t/ConvertReproFig'
const test = module('Convert Reproducible Figure')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('reproducible-jats.xml')

test("r2t: Import reproducable figure", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertReproFig()
  converter.import(dom)
  let reproFig = dom.find('#f1')
  t.equal(reproFig.tagName, 'repro-fig')
  let sourceCode = reproFig.find('source-code')
  t.equal(sourceCode.textContent, 'scatter3d(data)')
  t.equal(sourceCode.attr('language'), 'mini')

  let output = reproFig.find('output')
  t.equal(output.textContent, '{}')
  t.equal(output.attr('language'), 'json')
  let caption = reproFig.find('caption')
  t.ok(caption)
  t.end()
})

test("r2t: Export reproducible figure", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertReproFig()
  converter.import(dom)
  converter.export(dom)
  let reproFig = dom.find('#f1')
  t.equal(reproFig.tagName, 'fig')
  let sourceCode = reproFig.find('alternatives > code[specific-use=source]')
  t.equal(sourceCode.textContent, 'scatter3d(data)')
  t.equal(sourceCode.attr('language'), 'mini')

  let output = reproFig.find('alternatives > code[specific-use=output]')
  t.equal(output.textContent, '{}')
  t.equal(output.attr('language'), 'json')
  t.end()
})
