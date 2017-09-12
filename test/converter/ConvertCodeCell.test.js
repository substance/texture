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
  t.equal(sourceCode.textContent, 'x=5', 'source code should be the same')
  t.equal(output.attr('language'), 'json', 'output language should be "json"')
  t.equal(output.textContent, '{"execution_time": 1, "value_type": "number", "value": 5 }', 'output code should be the same')
  t.end()
})

test("r2t: Import Stencila local context cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  let cell = dom.find('#cell2')
  t.ok(cell, 'cell should be found')
  t.equal(cell.tagName, 'cell', 'tagName should now be cell')
  let sourceCodes = cell.findAll('source-code')
  let sourceCodeMini = sourceCodes[0]
  let sourceCodeNode = sourceCodes[1]
  let output = cell.find('output')

  t.equal(sourceCodes.length, 2, 'there should be two source-code items')
  t.equal(sourceCodeMini.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCodeMini.textContent, 'node(x)', 'source code should be the same')
  t.equal(sourceCodeNode.attr('language'), 'node', 'language should be "node"')
  t.equal(sourceCodeNode.textContent, "process.title + ' ' + process.version + ' x=' + x.toString() ", 'source code should be the same')
  t.equal(output.attr('language'), 'json', 'output language should be "json"')
  t.equal(output.textContent, '{"execution_time": 1, "value_type": "string", "value": \'node v6.9.2 x=5\' }', 'output code should be the same')
  t.end()
})

test("r2t: Import Jupyter global context cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  let cell = dom.find('#cell3')
  t.ok(cell, 'cell should be found')
  t.equal(cell.tagName, 'cell', 'tagName should now be cell')
  let sourceCodes = cell.findAll('source-code')
  let sourceCodeMini = sourceCodes[0]
  let sourceCodeNode = sourceCodes[1]
  let output = cell.find('output')

  t.equal(sourceCodes.length, 2, 'there should be two source-code items')
  t.equal(sourceCodeMini.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCodeMini.textContent, 'node()', 'source code should be the same')
  t.equal(sourceCodeNode.attr('language'), 'node', 'language should be "node"')
  t.equal(sourceCodeNode.textContent, "process.title + ' ' + process.version ", 'source code should be the same')
  t.equal(output.attr('language'), 'json', 'output language should be "json"')
  t.equal(output.textContent, '{"execution_time": 1, "value_type": "string", "value": \'node v6.9.2\' }', 'output code should be the same')
  t.end()
})

test("r2t: Export pure Mini cell ", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)

  let code = dom.find('#cell1')
  t.ok(code, 'code should be found')
  t.equal(code.tagName, 'code', 'tagName should now be code')
  let sourceCode = code.find('code[specific-use="source"]')
  let outputCode = code.find('code[specific-use="output"]')

  t.equal(sourceCode.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCode.attr('specific-use'), 'source', 'specific-use should be "source"')
  t.equal(sourceCode.textContent, 'x=5', 'source code should be the same')
  t.equal(outputCode.attr('language'), 'json', 'output language should be "json"')
  t.equal(outputCode.attr('specific-use'), 'output', 'specific-use should be "output"')
  t.equal(outputCode.textContent, '{"execution_time": 1, "value_type": "number", "value": 5 }', 'output code should be the same')
  
  t.end()
})

test("r2t: Export Stencila local context cell ", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)

  let code = dom.find('#cell2')
  t.ok(code, 'code should be found')
  t.equal(code.tagName, 'code', 'tagName should now be code')
  let sourceCodes = code.findAll('code[specific-use="source"]')
  let sourceCodeMini = sourceCodes[0]
  let sourceCodeNode = sourceCodes[1]
  let outputCode = code.find('code[specific-use="output"]')

  t.equal(sourceCodes.length, 2, 'there should be two source-code items')
  t.equal(sourceCodeMini.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCodeMini.attr('specific-use'), 'source', 'specific-use should be "source"')
  t.equal(sourceCodeMini.textContent, 'node(x)', 'source code should be the same')
  t.equal(sourceCodeNode.attr('language'), 'node', 'language should be "node"')
  t.equal(sourceCodeNode.attr('specific-use'), 'source', 'specific-use should be "source"')
  t.equal(sourceCodeNode.textContent, "process.title + ' ' + process.version + ' x=' + x.toString() ", 'source code should be the same')
  t.equal(outputCode.attr('language'), 'json', 'output language should be "json"')
  t.equal(outputCode.attr('specific-use'), 'output', 'specific-use should be "output"')
  t.equal(outputCode.textContent, '{"execution_time": 1, "value_type": "string", "value": \'node v6.9.2 x=5\' }', 'output code should be the same')
  
  t.end()
})

test("r2t: Export Jupyter global context cell", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertCodeCell()
  converter.import(dom)
  converter.export(dom)
  
  let code = dom.find('#cell3')
  t.ok(code, 'code should be found')
  t.equal(code.tagName, 'code', 'tagName should now be code')
  let sourceCodes = code.findAll('code[specific-use="source"]')
  let sourceCodeNode = sourceCodes[0]
  let outputCode = code.find('code[specific-use="output"]')

  t.equal(sourceCodes.length, 1, 'there should be one source-code item')
  t.equal(sourceCodeNode.attr('language'), 'node', 'language should be "node"')
  t.equal(sourceCodeNode.attr('specific-use'), 'source', 'specific-use should be "source"')
  t.equal(sourceCodeNode.textContent, "process.title + ' ' + process.version ", 'source code should be the same')
  t.equal(outputCode.attr('language'), 'json', 'output language should be "json"')
  t.equal(outputCode.attr('specific-use'), 'output', 'specific-use should be "output"')
  t.equal(outputCode.textContent, '{"execution_time": 1, "value_type": "string", "value": \'node v6.9.2\' }', 'output code should be the same')

  t.end()
})
