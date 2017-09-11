import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'

import ConvertReproFig from '../../src/converter/r2t/ConvertReproFig'
const test = module('Convert Reproducable Figure')
import readFixture from '../fixture/readFixture'
let fixture = readFixture('reproducible-jats.xml')

// <fig id="f1" fig-type="repro-fig">
//   <caption>
//     <title>Biodiversity on Mars</title>
//     <p>Lorem ipsum</p>
//   </caption>
//   <alternatives>
//     <code specific-use="source" language="mini"><![CDATA[scatter3d(co_occurence_matrix)]]></code>
//     <code specific-use="output" language="json"><![CDATA[{"execution_time": 1, "value_type": "plot-ly", "value": {} }]]></code>
//   </alternatives>
//   <graphic specific-use="output" xlink:href="89f8b53e361f.png"/>
// </fig>
//
// =>
//
// <repro-fig id="f1">
//   <caption>
//     <title>Biodiversity on Mars</title>
//     <p>Lorem ipsum</p>
//   </caption>
//   <source-code language="mini"><![CDATA[scatter3d(co_occurence_matrix)]]></source-code>
//   <output language="json"><![CDATA[{"execution_time": 1, "value_type": "plot-ly", "value": {} }]]></output>
//   <graphic specific-use="output" xlink:href="89f8b53e361f.png"/>
// </repro-fig>

test("r2t: Import reproducable figure", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertReproFig()
  converter.import(dom)
  let figure = dom.find('#f1')
  t.ok(figure, 'figure should be found')
  t.equal(figure.tagName, 'repro-fig', 'tagName should now be repro-fig')
  let sourceCode = figure.find('source-code')
  let output = figure.find('output')
  let caption = figure.find('caption')
  let title = caption.find('title')
  let graphic = figure.find('graphic')

  t.equal(sourceCode.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCode.textContent, 'scatter3d(co_occurence_matrix)', 'source code should be the same')
  t.equal(output.attr('language'), 'json', 'output language should be "json"')
  t.equal(output.textContent, '{"execution_time": 1, "value_type": "plot-ly", "value": {} }', 'output code should be the same')
  
  t.ok(caption, 'figure should contain caption')
  t.ok(title, 'caption should contain title')
  t.equal(title.textContent, 'Biodiversity on Mars', 'title should be "Biodiversity on Mars"')
  t.ok(graphic, 'figure should contain graphic')
  t.equal(graphic.attr('specific-use'), 'output', 'graphic specific-use should be "output"')
  t.equal(graphic.attr('xlink:href'), '89f8b53e361f.png', 'graphic xlink:href should be "89f8b53e361f.png"')

  t.end()
})

test("r2t: Export reproducable figure", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertReproFig()
  converter.import(dom)
  converter.export(dom)

  let fig = dom.find('#f1')
  t.ok(fig, 'figure should be found')
  t.equal(fig.tagName, 'fig', 'tagName should now be fig')
  let sourceCode = fig.find('code[specific-use="source"]')
  let outputCode = fig.find('code[specific-use="output"]')
  let caption = fig.find('caption')
  let title = fig.find('title')
  let graphic = fig.find('graphic')

  t.ok(caption, 'figure should contain caption')
  t.ok(title, 'caption should contain title')
  t.equal(title.textContent, 'Biodiversity on Mars', 'title should be "Biodiversity on Mars"')

  t.equal(sourceCode.attr('language'), 'mini', 'language should be "mini"')
  t.equal(sourceCode.attr('specific-use'), 'source', 'specific-use should be "source"')
  t.equal(sourceCode.textContent, 'scatter3d(co_occurence_matrix)', 'source code should be the same')
  t.equal(sourceCode.getParent().tagName, 'alternatives', 'source code should be wrapped by alternatives')
  t.equal(outputCode.attr('language'), 'json', 'output language should be "json"')
  t.equal(outputCode.attr('specific-use'), 'output', 'specific-use should be "output"')
  t.equal(outputCode.textContent, '{"execution_time": 1, "value_type": "plot-ly", "value": {} }', 'output code should be the same')
  t.equal(outputCode.getParent().tagName, 'alternatives', 'output code should be wrapped by alternatives')

  t.ok(graphic, 'figure should contain graphic')
  t.equal(graphic.attr('specific-use'), 'output', 'graphic specific-use should be "output"')
  t.equal(graphic.attr('xlink:href'), '89f8b53e361f.png', 'graphic xlink:href should be "89f8b53e361f.png"')

  t.end()
})