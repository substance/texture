import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { Sec2Heading } from 'substance-texture'

const test = module('Sec2Heading')

const two_sections = `
<body>
  <sec id="s1">
    <title>1</title>
    <p>p1</p>
  </sec>
  <sec id="s2">
    <title>2</title>
    <p>p2</p>
  </sec>
</body>
`
test("Sections to headings (two sections)", function(t) {
  let els = DefaultDOMElement.parseSnippet(two_sections, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 4, 'body should have 4 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'heading', 'section1 should be converted into a heading')
  t.equal(s1.attr('level'), '1', '.. of level 1')
  t.equal(s1.textContent, '1', '.. and the section title transferred')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'heading', 'section2 should be converted into a heading')
  t.equal(s2.attr('level'), '1', '.. of level 1')
  t.equal(s2.textContent, '2', '.. and the section title transferred')
  t.end()
})

test("Headings to sections (two sections)", function(t) {
  let els = DefaultDOMElement.parseSnippet(two_sections, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  converter.export(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 2, 'body should have 2 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'sec', 's1 should be converted into a sec')
  t.equal(s1.children.length, 2, '.. and should have 2 children')
  let s1_title = s1.find('title')
  t.notNil(s1_title, 's1 should have a title element')
  t.equal(s1_title.textContent, '1', '.. with correct content')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'sec', 's2 should be converted into a sec')
  t.equal(s2.children.length, 2, '.. and should have 2 children')
  let s2_title = s2.find('title')
  t.notNil(s2_title, 's2 should have a title element')
  t.equal(s2_title.textContent, '2', '.. with correct content')
  t.end()
})

const nested_sections = `
<body>
  <sec id="s1">
    <title>1</title>
    <p>p1</p>
    <sec id="s1_2">
      <title>1.2</title>
      <p>p12</p>
    </sec>
  </sec>
  <sec id="s2">
    <title>2</title>
    <p>p2</p>
  </sec>
</body>
`
test("Sections to headings (nested sections)", function(t) {
  let els = DefaultDOMElement.parseSnippet(nested_sections, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 6, 'body should have 6 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'heading', 's1 should be converted into a heading')
  t.equal(s1.attr('level'), '1', '.. of level 1')
  t.equal(s1.textContent, '1', '.. and the section title transferred')
  let s1_2 = dom.find('#s1_2')
  t.equal(s1_2.tagName, 'heading', 's1_2 should be converted into a heading')
  t.equal(s1_2.attr('level'), '2', '.. of level 2')
  t.equal(s1_2.textContent, '1.2', '.. and the section title transferred')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'heading', 's2 should be converted into a heading')
  t.equal(s2.attr('level'), '1', '.. of level 1')
  t.equal(s2.textContent, '2', '.. and the section title transferred')
  t.end()
})

test("Headings to sections (nested sections)", function(t) {
  let els = DefaultDOMElement.parseSnippet(nested_sections, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  converter.export(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 2, 'body should have 2 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'sec', 's1 should be converted into a sec')
  t.equal(s1.children.length, 3, '.. and should have 3 children')
  let s1_title = s1.find('title')
  t.notNil(s1_title, 's1 should have a title element')
  t.equal(s1_title.textContent, '1', '.. with correct content')
  let s1_2 = dom.find('#s1_2')
  t.equal(s1_2.tagName, 'sec', 's1_2 should be converted into a sec')
  t.equal(s1_2.children.length, 2, '.. and should have 2 children')
  let s1_2_title = s1_2.find('title')
  t.notNil(s1_2_title, 's1_2 should have a title element')
  t.equal(s1_2_title.textContent, '1.2', '.. with correct content')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'sec', 's2 should be converted into a sec')
  t.equal(s2.children.length, 2, '.. and should have 2 children')
  let s2_title = s2.find('title')
  t.notNil(s2_title, 's2 should have a title element')
  t.equal(s2_title.textContent, '2', '.. with correct content')
  t.end()
})
