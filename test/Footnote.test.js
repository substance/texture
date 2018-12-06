import { test } from 'substance-test'
import { openManuscriptEditor, getDocument, setSelection, fixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { getLabel } from '../index'

// TODO
// test('Footnotes: add a footnote in the manuscript', t => {
//   t.fail('Implement this when there is a "Insert Footnote" in manuscript view')
//   t.end()
// })

// TODO
// test('Footnotes: add a footnote in a table-figure', t => {
//   t.fail('Implement this when there is a "Insert Footnote" in manuscript view')
//   t.end()
// })

// TODO: @daniel add more tests which make sense from the user point of view.
// In addition let's look at the code coverage of the code we have added in this PR, and add tests needed to cover everything.

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
    t.equal(getLabel(xref), '1', 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
})

test('Footnotes: reference a footnote from a table-cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, 't-1_2_1.content', 1)
  _insertCrossRef(editor, 'fn', 'table-1-fn-1')
  let td = doc.get('t-1_2_1')
  let annos = td.getAnnotations()
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType: 'table-fn',
      rid: 'table-1-fn-1'
    }
    t.deepEqual(actual, expected, 'a xref to table-1-fn-1 should have been created')
    t.equal(getLabel(xref), '*', 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
})

test('Footnotes: reference a footnote from a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  _insertCrossRef(editor, 'fn', 'table-1-fn-1')
  let p = doc.get('table-1-caption-p-1')
  let annos = p.getAnnotations()
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType: 'table-fn',
      rid: 'table-1-fn-1'
    }
    t.deepEqual(actual, expected, 'a xref to table-1-fn-1 should have been created')
    t.equal(getLabel(xref), '*', 'label should be correct')
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
