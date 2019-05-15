import { test } from 'substance-test'
import { createTestVfs, openManuscriptEditor } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { DEFAULT_JATS_SCHEMA_ID, DEFAULT_JATS_DTD } from 'substance-texture'

const xrefTypes = {
  'bibr': 'reference',
  'fig': 'figure',
  'table': 'table',
  'fn': 'footnote',
  'disp-formula': 'block-formula'
}

const DOUBLE_CITATIONS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "${DEFAULT_JATS_SCHEMA_ID}" "${DEFAULT_JATS_DTD}">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
    </article-meta>
  </front>
  <body>
    <p id="p-bibr">Lorem <xref id="xref-bibr" ref-type="bibr" rid="r1 r2">[1,2]</xref> ipsum.</p>
    <p id="p-fig">Lorem <xref id="xref-fig" ref-type="fig" rid="fig1 fig2">[Figure 1, Figure 2]</xref> ipsum.</p>
    <p id="p-table">Lorem <xref id="xref-table" ref-type="table" rid="t1 t2">[Table 1, Table 2]</xref> ipsum.</p>
    <p id="p-fn">Lorem <xref id="xref-fn" ref-type="fn" rid="fn1 fn2">[1,2]</xref> ipsum.</p>
    <p id="p-formula">Lorem <xref id="xref-disp-formula" ref-type="disp-formula" rid="disp-formula-1 disp-formula-2">(1,2)</xref> ipsum.</p>
    <table-wrap id="t1"><table><tbody><tr><td></td></tr></tbody></table></table-wrap>
    <table-wrap id="t2"><table><tbody><tr><td></td></tr></tbody></table></table-wrap>
    <fig id="fig1"><graphic /></fig>
    <fig id="fig2"><graphic /></fig>
    <disp-formula id="disp-formula-1" content-type="math/tex">
      <label>(1)</label>
      <tex-math><![CDATA[x]]></tex-math>
    </disp-formula>
    <disp-formula id="disp-formula-2" content-type="math/tex">
      <label>(2)</label>
      <tex-math><![CDATA[y]]></tex-math>
    </disp-formula>
  </body>
  <back>
    <fn-group>
      <fn id="fn1"><p></p></fn>
      <fn id="fn2"><p></p></fn>
    </fn-group>
    <ref-list>
      <ref id="r1"><element-citation publication-type="book"><publisher-loc>New York</publisher-loc><publisher-name>Test Press</publisher-name><pub-id pub-id-type="isbn">000</pub-id><person-group person-group-type="author"><name><surname>Test</surname></name></person-group></element-citation></ref>
      <ref id="r2"><element-citation publication-type="book"><publisher-loc>New York</publisher-loc><publisher-name>Test Press</publisher-name><pub-id pub-id-type="isbn">001</pub-id><person-group person-group-type="author"><name><surname>Test</surname></name></person-group></element-citation></ref>
    </ref-list>
  </back>
</article>
`

Object.keys(xrefTypes).forEach(annoType => {
  test(`CrossReference: untoggle ${xrefTypes[annoType]} cross-reference (#959)`, t => {
    testCitationUntoggle(t, annoType)
  })
})

function testCitationUntoggle (t, xrefType) {
  let { editor } = _setup(t, DOUBLE_CITATIONS)
  const selector = '[data-id="xref-' + xrefType + '"]'

  // Toggle edit citation dialog
  const xref = editor.find(selector)
  const xrefLabelBefore = _getText(editor, selector)
  xref.click()

  // Toggle first citation in list
  const firstXref = editor.find('.sc-edit-xref-tool .se-option.sm-selected .sc-preview')
  // Note: There is no way to detect exception in browser
  firstXref.click()
  const xrefLabelAfter = _getText(editor, selector)

  t.ok(xrefLabelBefore !== xrefLabelAfter, 'Label should change')
  t.notEqual(xrefLabelAfter, '???', 'Label should not disappear')
  t.end()
}

function _getText (editor, selector) {
  return editor.find(selector).text()
}

function _setup (t, seedXML) {
  let testVfs = createTestVfs(seedXML)
  let { app } = setupTestApp(t, {
    vfs: testVfs,
    archiveId: 'test'
  })
  let editor = openManuscriptEditor(app)
  return { editor }
}
