import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import { importElement, exportElement } from './shared/testHelpers'

const PREFORMAT_EXAMPLE = `
<preformat id="preformat-1" preformat-type="code">
  <![CDATA[Math.sqrt((a * a) + (b * b))]]>
</preformat>
`

const WITHOUT_CDATA = `
<preformat>alert()</preformat>
`

test('PreformatConverter: import preformat', t => {
  let el = DefaultDOMElement.parseSnippet(PREFORMAT_EXAMPLE.trim(), 'xml')
  let preformatNode = importElement(el)
  t.equal(preformatNode.id, 'preformat-1', 'id should be preserved')
  t.equal(preformatNode.preformatType, 'code', 'preformat type should be preserved')
  t.equal(preformatNode.content, 'Math.sqrt((a * a) + (b * b))', 'content should contain preformat, but without CDATA section')
  t.end()
})

test('PreformatConverter: import and export tag without type and cdata', t => {
  let el = DefaultDOMElement.parseSnippet(WITHOUT_CDATA.trim(), 'xml')
  let preformatNode = importElement(el)
  t.equal(preformatNode.preformatType, 'code', 'preformat type should be code')
  t.equal(preformatNode.content, 'alert()', 'content should contain preformat')
  let preformatEl = exportElement(el)
  t.equal(preformatEl.getAttribute('preformat-type'), 'preformat-type should be code')
  t.equal(preformatEl.getFirstChild().nodeType, 'cdata', 'preformat should contain cdata element')
  t.end()
})
