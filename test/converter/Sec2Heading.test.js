import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { Sec2Heading } from '../../index'

const TWO_SECTIONS = `
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
test('Sec2Heading: Sections to headings (two sections)', function (t) {
  let els = DefaultDOMElement.parseSnippet(TWO_SECTIONS, 'xml')
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

test('Sec2Heading: Headings to sections (two sections)', function (t) {
  let els = DefaultDOMElement.parseSnippet(TWO_SECTIONS, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  converter.export(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 2, 'body should have 2 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'sec', 's1 should be converted into a sec')
  t.equal(s1.children.length, 2, '.. and should have 2 children')
  let s1Title = s1.find('title')
  t.notNil(s1Title, 's1 should have a title element')
  t.equal(s1Title.textContent, '1', '.. with correct content')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'sec', 's2 should be converted into a sec')
  t.equal(s2.children.length, 2, '.. and should have 2 children')
  let s2Title = s2.find('title')
  t.notNil(s2Title, 's2 should have a title element')
  t.equal(s2Title.textContent, '2', '.. with correct content')
  t.end()
})

const NESTED_SECTIONS = `
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
test('Sec2Heading: Sections to headings (nested sections)', function (t) {
  let els = DefaultDOMElement.parseSnippet(NESTED_SECTIONS, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 6, 'body should have 6 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'heading', 's1 should be converted into a heading')
  t.equal(s1.attr('level'), '1', '.. of level 1')
  t.equal(s1.textContent, '1', '.. and the section title transferred')
  let s12 = dom.find('#s1_2')
  t.equal(s12.tagName, 'heading', 's1_2 should be converted into a heading')
  t.equal(s12.attr('level'), '2', '.. of level 2')
  t.equal(s12.textContent, '1.2', '.. and the section title transferred')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'heading', 's2 should be converted into a heading')
  t.equal(s2.attr('level'), '1', '.. of level 1')
  t.equal(s2.textContent, '2', '.. and the section title transferred')
  t.end()
})

test('Sec2Heading: Headings to sections (nested sections)', function (t) {
  let els = DefaultDOMElement.parseSnippet(NESTED_SECTIONS, 'xml')
  let dom = els[0].getOwnerDocument()
  let converter = new Sec2Heading()
  converter.import(dom)
  converter.export(dom)
  let body = dom.find('body')
  t.equal(body.children.length, 2, 'body should have 2 children')
  let s1 = dom.find('#s1')
  t.equal(s1.tagName, 'sec', 's1 should be converted into a sec')
  t.equal(s1.children.length, 3, '.. and should have 3 children')
  let s1Title = s1.find('title')
  t.notNil(s1Title, 's1 should have a title element')
  t.equal(s1Title.textContent, '1', '.. with correct content')
  let s12 = dom.find('#s1_2')
  t.equal(s12.tagName, 'sec', 's1_2 should be converted into a sec')
  t.equal(s12.children.length, 2, '.. and should have 2 children')
  let s12Title = s12.find('title')
  t.notNil(s12Title, 's1_2 should have a title element')
  t.equal(s12Title.textContent, '1.2', '.. with correct content')
  let s2 = dom.find('#s2')
  t.equal(s2.tagName, 'sec', 's2 should be converted into a sec')
  t.equal(s2.children.length, 2, '.. and should have 2 children')
  let s2Title = s2.find('title')
  t.notNil(s2Title, 's2 should have a title element')
  t.equal(s2Title.textContent, '2', '.. with correct content')
  t.end()
})
