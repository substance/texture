import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'

// TODO: export all trafos via index.es.js, and import {..} from '../../index.es.js'
import ConvertCodeCell from '../../src/converter/r2t/ConvertCodeCell'
const test = module('Convert Code Cell')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('reproducible-jats.xml')

// <code specific-use="cell" id="cell1">
//   <named-content><alternatives>
//     <code specific-use="source" language="mini"><![CDATA[x=5]]></code>
//     <code specific-use="output" language="json"><![CDATA[{"execution_time": 1, "value_type": "number", "value": 5 }]]></code>
//   </alternatives></named-content>
// </code>
//
// =>
//
// <cell id="cell1">
//   <source-code language="mini"><![CDATA[x=5]]></source-code>
//   <output language="json"><![CDATA[{"execution_time": 1, "value_type": "number", "value": 5 }]]></output>
// </cell>
test("r2t: Import pure Mini cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  let cell = dom.find('#cell1')
  t.ok(cell, 'cell should be found')
  t.equal(cell.tagName, 'cell', 'tagName should now be cell')
  let sourceCode = cell.find('source-code')
  let output = cell.find('output')

  t.equal(sourceCode.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCode.textContent, 'x=5', 'Code should be the same')
  t.equal(output.attr('language'), 'json', 'output language should be "json"')
  t.equal(output.textContent, '{"execution_time": 1, "value_type": "number", "value": 5 }', 'Code should be the same')
  t.end()
})

test("r2t: Import Stencila local context cell", function(t) {
  // TODO: implement
  t.end()
})

test("r2t: Import Jupyter global context cell", function(t) {
  // TODO: implement
  t.end()
})

test("r2t: Export pure Mini cell ", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)
  // TODO: check!
  t.end()
})

test("r2t: Export Stencila local context cell ", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)
  // TODO: check!
  t.end()
})

test("r2t: Export Jupyter global context cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)
  // TODO: check!
  t.end()
})
