import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { ConvertFig } from 'substance-texture'
import readFixture from '../fixture/readFixture'

const fixture = readFixture('fig.xml')

test('ConvertFig: Extract caption title from figure', function (t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  // title should now be child of fig, and caption a container of paragraphs
  let title = dom.find('#fig1 > title')
  let caption = dom.find('#fig1 > caption')
  t.notNil(title, '<title> should be child of <fig>')
  t.equal(title.textContent, 'fig_title', '.. and title content should be correct')
  t.notNil(caption, '<caption> should be child of <fig>')
  t.equal(caption.serialize(), '<caption><p>fig_caption</p></caption>', '.. and should have correct content')
  t.end()
})

test('ConvertFig: Should expand title and caption if not there', function (t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let title = dom.find('#fig2 > title')
  let caption = dom.find('#fig2 > caption')
  // should create title and caption if does not exist
  t.notNil(title, '<title> should be child of <fig>')
  t.notNil(caption, '<caption> should be child of <fig>')
  t.end()
})

test('ConvertFig: Should expand title if not there', function (t) {
  let dom = DefaultDOMElement.parseXML(fixture)
  let converter = new ConvertFig()
  converter.import(dom)
  let title = dom.find('#fig3 > title')
  t.notNil(title, '<title> should be child of <fig>')
  t.end()
})
