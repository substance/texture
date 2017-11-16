import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { ConvertFig } from 'substance-texture'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('fig.xml')

const test = module('ConvertFig')

test("Extract caption title from figure", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#fig1')
  // title should now be child of fig, and caption a container of paragraphs
  t.equal(fn.outerHTML, '<fig id="fig1"><object-id pub-id-type="doi"/><title>fig_title</title><caption><p>fig_caption</p></caption><graphic xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="fig1.jpg"/></fig>')
  t.end()
})

test("Should expand title and caption if not there", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#fig2')
  // should create title and caption if does not exist
  t.equal(fn.outerHTML, '<fig id="fig2"><object-id pub-id-type="doi"/><title/><caption><p/></caption><graphic xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="fig2.jpg"/></fig>')
  t.end()
})


test("Should expand title if not there", function(t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let fn = dom.find('#fig3')
  // should create title and caption if does not exist
  t.equal(fn.outerHTML, '<fig id="fig3"><object-id pub-id-type="doi"/><title/><caption><p>fig_caption</p></caption><graphic xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="fig3.jpg"/></fig>')
  t.end()
})
