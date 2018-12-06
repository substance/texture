import { test } from 'substance-test'
import { openManuscriptEditor, getDocument, setSelection, fixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

test('Footnotes: add a footnote in the manuscript', t => {
  t.fail('Implement this when there is a "Insert Footnote" in manuscript view')
  t.end()
})

test('Footnotes: add a footnote in a table-figure', t => {
  t.fail('Implement this when there is a "Insert Footnote" in manuscript view')
  t.end()
})

test('Footnotes: reference a footnote from a paragraph in the manuscript body', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, 'p-0.content', 1)
  _insertCrossRef(editor, 'fn', 'fn-1')
  let p0 = doc.get('p-0')
  let annos = p0.getAnnotations()
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType: 'fn',
      rid: 'fn-1'
    }
    t.deepEqual(actual, expected, 'a xref to fn-1 should have been created')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
})

function _insertCrossRef (editor, refType, rid) {
  let citeMenu = editor.find('.sc-tool-dropdown.sm-cite')
  // open cite menu
  citeMenu.find('button').el.click()
  // click respective tool
  citeMenu.find(`.sm-insert-xref-${refType}`).el.click()
  // ..then the xref should be inserted with empty content
  // click on the target option with the given node id
  editor.find(`.sc-edit-xref-tool > .se-option > *[data-id=${rid}]`).click()
}
