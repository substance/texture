import { test } from 'substance-test'
import { DefaultDOMElement, uuid } from 'substance'
import {
  createJatsImporter, createJatsExporter, createEmptyJATS
} from 'substance-texture'
import { createEmptyArticle } from './shared/testHelpers'

const FLAT = `
<body id="body">
  <p>p1</p>
  <p>p2</p>
</body>
`
test('BodyConverter: import flat body', t => {
  let el = DefaultDOMElement.parseSnippet(FLAT.trim(), 'xml')
  let body = _importBody(el)
  t.equal(body.content.length, 2, 'body should have 2 children')
  t.end()
})

test('BodyConverter: export flat body', function (t) {
  let el = DefaultDOMElement.parseSnippet(FLAT.trim(), 'xml')
  let body = _importBody(el)
  let bodyEl = _exportBody(body)
  t.equal(bodyEl.getChildCount(), 2, 'body should have 2 children')
  t.end()
})

const TWO_SECTIONS = `
<body id="body">
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

test('BodyConverter: import two sections', t => {
  let el = DefaultDOMElement.parseSnippet(TWO_SECTIONS.trim(), 'xml')
  let body = _importBody(el)
  t.equal(body.content.length, 4, 'body should have 4 children')
  let s1 = body.find('#s1')
  t.equal(s1.type, 'heading', 'section1 should be converted into a heading')
  t.equal(s1.level, 1, '.. of level 1')
  t.equal(s1.getText(), '1', '.. and the section title transferred')
  let s2 = body.find('#s2')
  t.equal(s2.type, 'heading', 'section2 should be converted into a heading')
  t.equal(s2.level, 1, '.. of level 1')
  t.equal(s2.getText(), '2', '.. and the section title transferred')
  t.end()
})

test('BodyConverter: export two sections', function (t) {
  let el = DefaultDOMElement.parseSnippet(TWO_SECTIONS.trim(), 'xml')
  let body = _importBody(el)
  let bodyEl = _exportBody(body)
  t.equal(bodyEl.children.length, 2, 'body should have 2 children')
  let s1 = bodyEl.find('#s1')
  t.equal(s1.tagName, 'sec', 's1 should be converted into a sec')
  t.equal(s1.children.length, 2, '.. and should have 2 children')
  let s1Title = s1.find('title')
  t.notNil(s1Title, 's1 should have a title element')
  t.equal(s1Title.textContent, '1', '.. with correct content')
  let s2 = bodyEl.find('#s2')
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

test('BodyConverter: import nested sections', t => {
  let el = DefaultDOMElement.parseSnippet(NESTED_SECTIONS.trim(), 'xml')
  let body = _importBody(el)
  t.equal(body.content.length, 6, 'body should have 6 children')
  let s1 = body.find('#s1')
  t.equal(s1.type, 'heading', 's1 should be converted into a heading')
  t.equal(s1.level, 1, '.. of level 1')
  t.equal(s1.getText(), '1', '.. and the section title transferred')
  let s12 = body.find('#s1_2')
  t.equal(s12.type, 'heading', 's1_2 should be converted into a heading')
  t.equal(s12.level, 2, '.. of level 2')
  t.equal(s12.getText(), '1.2', '.. and the section title transferred')
  let s2 = body.find('#s2')
  t.equal(s2.type, 'heading', 's2 should be converted into a heading')
  t.equal(s2.level, 1, '.. of level 1')
  t.equal(s2.getText(), '2', '.. and the section title transferred')
  t.end()
})

test('BodyConverter: export nested sections', t => {
  let el = DefaultDOMElement.parseSnippet(NESTED_SECTIONS.trim(), 'xml')
  let bodyEl = _exportBody(_importBody(el))
  t.equal(bodyEl.children.length, 2, 'body should have 2 children')
  let s1 = bodyEl.find('#s1')
  t.equal(s1.tagName, 'sec', 's1 should be converted into a sec')
  t.equal(s1.children.length, 3, '.. and should have 3 children')
  let s1Title = s1.find('title')
  t.notNil(s1Title, 's1 should have a title element')
  t.equal(s1Title.textContent, '1', '.. with correct content')
  let s12 = bodyEl.find('#s1_2')
  t.equal(s12.tagName, 'sec', 's1_2 should be converted into a sec')
  t.equal(s12.children.length, 2, '.. and should have 2 children')
  let s12Title = s12.find('title')
  t.notNil(s12Title, 's1_2 should have a title element')
  t.equal(s12Title.textContent, '1.2', '.. with correct content')
  let s2 = bodyEl.find('#s2')
  t.equal(s2.tagName, 'sec', 's2 should be converted into a sec')
  t.equal(s2.children.length, 2, '.. and should have 2 children')
  let s2Title = s2.find('title')
  t.notNil(s2Title, 's2 should have a title element')
  t.equal(s2Title.textContent, '2', '.. with correct content')
  t.end()
})

function _importBody (bodyEl) {
  // TODO: create a minimal document, and the JATS importer
  // then run the converter and see if the body node has the proper content
  let doc = createEmptyArticle()
  let importer = createJatsImporter(doc)
  // ATTENTION: same as in the real jats2internal converter we must use a temporary id
  // here, because the body node already exists
  bodyEl.id = uuid()
  let tmpBody = importer.convertElement(bodyEl)
  let body = doc.get('body')
  doc.set(['body', 'content'], tmpBody.content)
  return body
}

function _exportBody (body) {
  let jats = createEmptyJATS()
  let exporter = createJatsExporter(jats, body.getDocument())
  return exporter.convertNode(body)
}
