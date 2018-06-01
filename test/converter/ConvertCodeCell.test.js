import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { ConvertCodeCell } from 'substance-texture'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('reproducible-jats.xml')

test("ConvertCodeCell: Import code cell", function(t) {
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

test("ConvertCodeCell: Export code cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom, {})
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
