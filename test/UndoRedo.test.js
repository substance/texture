import { test } from 'substance-test'
import {
  setCursor, openManuscriptEditor, loadBodyFixture, insertText, getDocument,
  clickUndo, clickRedo, getEditorSession, breakText
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const P1 = `<p id="p1">Lorem ipsum dolor sit amet.</p>`

test('UndoRedo: changing plain text', t => {
  let { editor } = _setup(t, P1)
  let doc = getDocument(editor)
  let p1 = doc.get('p1')

  t.comment('applying changes')
  setCursor(editor, 'p1.content', 0)
  insertText(editor, 'xxx')
  setCursor(editor, 'p1.content', 10)
  insertText(editor, 'yyy')
  setCursor(editor, 'p1.content', 19)
  insertText(editor, 'zzz')
  t.equal(p1.getText(), 'xxxLorem iyyypsum dzzzolor sit amet.')

  t.comment('undoing changes')
  clickUndo(editor)
  t.equal(p1.getText(), 'xxxLorem iyyypsum dolor sit amet.')
  clickUndo(editor)
  t.equal(p1.getText(), 'xxxLorem ipsum dolor sit amet.')
  clickUndo(editor)
  t.equal(p1.getText(), 'Lorem ipsum dolor sit amet.')

  t.comment('redoing changes')
  clickRedo(editor)
  t.equal(p1.getText(), 'xxxLorem ipsum dolor sit amet.')
  clickRedo(editor)
  t.equal(p1.getText(), 'xxxLorem iyyypsum dolor sit amet.')
  clickRedo(editor)
  t.equal(p1.getText(), 'xxxLorem iyyypsum dzzzolor sit amet.')

  t.end()
})

const P1_WITH_ANNOS = `<p id="p1">Lorem <bold id="bold1">ipsum</bold> <italic id="italic1">dolor</italic> sit amet.</p>`

test('UndoRedo: changing annotated text', t => {
  let { editor } = _setup(t, P1_WITH_ANNOS)
  let doc = getDocument(editor)
  let p = doc.get('p1')
  let bold = doc.get('bold1')
  let italic = doc.get('italic1')

  function _getAnnoPos (anno) { return [anno.start.offset, anno.end.offset] }

  t.comment('applying changes')
  setCursor(editor, 'p1.content', 0)
  insertText(editor, 'xxx')
  setCursor(editor, 'p1.content', 10)
  insertText(editor, 'yyy')
  setCursor(editor, 'p1.content', 19)
  insertText(editor, 'zzz')
  t.equal(p.getText(), 'xxxLorem iyyypsum dzzzolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6 + 3, 11 + 6])
  t.deepEqual(_getAnnoPos(italic), [12 + 6, 17 + 9])

  t.comment('undoing changes')
  clickUndo(editor)
  t.equal(p.getText(), 'xxxLorem iyyypsum dolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6 + 3, 11 + 6])
  t.deepEqual(_getAnnoPos(italic), [12 + 6, 17 + 6])
  clickUndo(editor)
  t.equal(p.getText(), 'xxxLorem ipsum dolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6 + 3, 11 + 3])
  t.deepEqual(_getAnnoPos(italic), [12 + 3, 17 + 3])
  clickUndo(editor)
  t.equal(p.getText(), 'Lorem ipsum dolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6, 11])
  t.deepEqual(_getAnnoPos(italic), [12, 17])

  t.comment('redoing changes')
  clickRedo(editor)
  t.equal(p.getText(), 'xxxLorem ipsum dolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6 + 3, 11 + 3])
  t.deepEqual(_getAnnoPos(italic), [12 + 3, 17 + 3])
  clickRedo(editor)
  t.equal(p.getText(), 'xxxLorem iyyypsum dolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6 + 3, 11 + 6])
  t.deepEqual(_getAnnoPos(italic), [12 + 6, 17 + 6])
  clickRedo(editor)
  t.equal(p.getText(), 'xxxLorem iyyypsum dzzzolor sit amet.')
  t.deepEqual(_getAnnoPos(bold), [6 + 3, 11 + 6])
  t.deepEqual(_getAnnoPos(italic), [12 + 6, 17 + 9])

  t.end()
})

test('UndoRedo: creating and deleting a node', t => {
  let { editor } = _setup(t)
  let editorSession = getEditorSession(editor)
  let doc = getDocument(editor)

  t.comment('create a paragraph')
  editorSession.transaction(tx => {
    let body = tx.get('body')
    tx.create({
      type: 'paragraph',
      id: 'p1'
    })
    body.append('p1')
  })
  t.deepEqual(doc.get('body').content, ['p1'])

  t.comment('undo')
  clickUndo(editor)
  t.deepEqual(doc.get('body').content, [])

  t.comment('redo')
  clickRedo(editor)
  t.deepEqual(doc.get('body').content, ['p1'])

  t.end()
})

const LIST = `
<list list-type="bullet" id="list">
  <list-item id="li1">
    <p>Item 1</p>
    <list list-type="order">
      <list-item id="li1-1">
        <p>Item 1.1</p>
      </list-item>
      <list-item id="li1-2">
        <p>Item 1.2</p>
      </list-item>
    </list>
  </list-item>
  <list-item id="li2">
    <p>Item 2</p>
    <list list-type="order">
      <list-item id="li2-1">
        <p>Item 2.1</p>
      </list-item>
      <list-item id="li2-2">
        <p>Item 2.2</p>
      </list-item>
    </list>
  </list-item>
</list>
`

test('UndoRedo: breaking a list', t => {
  let { editor } = _setup(t, LIST)
  let doc = getDocument(editor)
  let body = doc.get('body')
  let list = doc.get('list')

  t.equal(body.getLength(), 1, 'body should have 1 item')
  t.equal(list.getLength(), 6, 'list should have 6 items')

  t.comment('break the list')
  setCursor(editor, 'li1-2.content', doc.get('li1-2').getLength())
  // Note: the first break creates an empty list items
  // and the second break splits the list apart
  breakText(editor)
  breakText(editor)
  t.equal(body.getLength(), 3, 'body should have 3 items')
  t.equal(list.getLength(), 3, 'first list should have 3 items')

  t.comment('undo')
  clickUndo(editor)
  t.equal(body.getLength(), 1, 'body should have 1 items')
  t.equal(list.getLength(), 7, 'first list should have 7 items')

  t.comment('2nd undo')
  clickUndo(editor)
  t.equal(body.getLength(), 1, 'body should have 1 items')
  t.equal(list.getLength(), 6, 'first list should have 6 items')

  t.end()
})

function _setup (t, bodyFixture) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, bodyFixture)
  return { editor }
}
