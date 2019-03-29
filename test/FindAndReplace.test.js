import { test } from 'substance-test'
import { setCursor, LOREM_IPSUM, getDocument, openManuscriptEditor, insertText, clickUndo, setSelection, deleteSelection } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: instead of the kitchen-sink we should use a fixture that has a defined content
// so that we can write proper test assertions

test('FindAndReplace: opening and closing the find and replace dialog', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  t.comment('opening the find dialog')
  let { fnrDialog } = _openFindAndReplaceDialog(editor)
  function _isFindInputVisible () { return Boolean(fnrDialog.find('input.sm-find')) }
  function _isReplaceInputVisible () { return Boolean(fnrDialog.find('input.sm-replace')) }

  t.notNil(fnrDialog, 'The dialog should be rendered')
  t.notOk(fnrDialog.hasClass('sm-hidden'), '.. and should be visible')
  t.ok(_isFindInputVisible(), 'an input field for the find patter should be displayed')

  t.comment('closing the dialog')
  _closeFindAndReplaceDialog(editor)
  t.ok(fnrDialog.hasClass('sm-hidden'), '.. and should be visible')

  t.comment('opening the replace dialog')
  _openFindAndReplaceDialog(editor, true)
  t.notOk(fnrDialog.hasClass('sm-hidden'), 'The dialog should be visible')
  t.ok(_isReplaceInputVisible(), 'an input field for the replace pattern should be displayed')

  t.comment('opening the dialog for find without closing')
  _openFindAndReplaceDialog(editor)
  t.notOk(_isReplaceInputVisible(), 'replace pattern field should not be displayed')

  t.end()
})

test('FindAndReplace: simple search', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(editor)
  let input = fnrDialog.find('.sm-find input')
  input.val('Lorem')
  input.el.emit('input')
  let state = fnrManager._getState()
  t.equal(state.count, 20, 'The number of case-insensitive matches should be correct')
  t.end()
})

test('FindAndReplace: clear search pattern', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(editor)
  let input = fnrDialog.find('.sm-find input')
  // first set the search field
  input.val('Lorem')
  input.el.emit('input')
  // then clear it again
  input.val('')
  input.el.emit('input')
  let state = fnrManager._getState()
  t.equal(state.count, 0, 'The number of case-insensitive matches should be correct')
  t.end()
})

test('FindAndReplace: find and replace', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(editor, true)
  let findInput = fnrDialog.find('.sm-find input')
  findInput.val('dolor')
  findInput.el.emit('input')
  let replaceInput = fnrDialog.find('.sm-replace input')
  replaceInput.val('xxx')
  replaceInput.el.emit('input')
  let replaceButton = fnrDialog.find('.sc-button.sm-replace')
  // there are 3 occurrences in the first paragraph
  replaceButton.click()
  replaceButton.click()
  let doc = getDocument(editor)
  let p1 = doc.get('p-1')
  let expectedText = 'Lorem ipsum xxx sit amet, consectetur adipiscing elit. Donec convallis augue ut orci finibus laoreet. Aliquam venenatis ante scelerisque lectus malesuada, ut blandit leo facilisis. Integer at egestas urna. Nulla facilisi. Quisque imperdiet fermentum euismod. Donec vestibulum semper lorem id accumsan. In ut ligula at enim tempus dictum in nec sapien. Sed suscipit aliquam sapien sit amet cursus. Integer tincidunt est nulla, sit amet bibendum sem condimentum in. Nulla bibendum non lorem eget feugiat. Mauris metus libero, euismod sed ante vitae, euismod commodo leo. Aliquam cursus, tellus at rhoncus molestie, orci sapien iaculis massa, vitae venenatis justo quam eget xxx. Integer mollis imperdiet nunc, vel condimentum magna euismod nec. Mauris ornare, tortor vitae suscipit hendrerit, nunc sem congue ante, nec elementum lorem lorem lacinia magna. Donec vehicula, nisi eget facilisis egestas, dolor urna fringilla nisl, blandit vulputate quam ante vel magna. Nulla vitae maximus massa.'
  t.equal(p1.getText(), expectedText, 'The first paragraph text should have been replaced correctly')
  let state = fnrManager._getState()
  t.equal(state.count, 4, 'There should be 4 occurrences left')
  t.end()
})

test('FindAndReplace: replaceAll', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(editor, true)
  let findInput = fnrDialog.find('.sm-find input')
  findInput.val('dolor')
  findInput.el.emit('input')
  let replaceInput = fnrDialog.find('.sm-replace input')
  replaceInput.val('yyy')
  replaceInput.el.emit('input')
  let replaceButton = fnrDialog.find('.sc-button.sm-replace-all')
  replaceButton.click()
  let doc = getDocument(editor)
  let p1 = doc.get('p-1')
  let expectedText = 'Lorem ipsum yyy sit amet, consectetur adipiscing elit. Donec convallis augue ut orci finibus laoreet. Aliquam venenatis ante scelerisque lectus malesuada, ut blandit leo facilisis. Integer at egestas urna. Nulla facilisi. Quisque imperdiet fermentum euismod. Donec vestibulum semper lorem id accumsan. In ut ligula at enim tempus dictum in nec sapien. Sed suscipit aliquam sapien sit amet cursus. Integer tincidunt est nulla, sit amet bibendum sem condimentum in. Nulla bibendum non lorem eget feugiat. Mauris metus libero, euismod sed ante vitae, euismod commodo leo. Aliquam cursus, tellus at rhoncus molestie, orci sapien iaculis massa, vitae venenatis justo quam eget yyy. Integer mollis imperdiet nunc, vel condimentum magna euismod nec. Mauris ornare, tortor vitae suscipit hendrerit, nunc sem congue ante, nec elementum lorem lorem lacinia magna. Donec vehicula, nisi eget facilisis egestas, yyy urna fringilla nisl, blandit vulputate quam ante vel magna. Nulla vitae maximus massa.'
  t.equal(p1.getText(), expectedText, 'The first paragraph text should have been replaced correctly')
  let state = fnrManager._getState()
  t.equal(state.count, 0, 'There should be no occurrences left')
  t.end()
})

test('FindAndReplace: replaceAll (replace pattern)', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrManager } = _openFindAndReplaceDialog(editor, true)
  fnrManager.toggleCaseSensitivity()
  fnrManager.toggleFullWordSearch()
  fnrManager.toggleRegexSearch()
  fnrManager.setSearchPattern('d(.+?)')
  fnrManager.setReplacePattern('D$1')
  fnrManager.replaceNext()
  let doc = getDocument(editor)
  let abstractP1 = doc.get('abstract-p-1')
  let expected = 'Lorem Ipsum is simply Dummy'
  let actual = abstractP1.getText().slice(0, expected.length)
  t.equal(actual, expected, 'The first paragraph text should have been replaced correctly')
  t.end()
})

test('FindAndReplace: navigating matches', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(editor)
  function _next () {
    fnrDialog.find('button.sm-next').click()
    return true
  }
  function _previous () {
    fnrDialog.find('button.sm-previous').click()
    return true
  }

  let input = fnrDialog.find('.sm-find input')
  input.val('Lorem')
  input.el.emit('input')
  let state = fnrManager._getState()
  let count = state.count
  t.equal(state.cursor, 0, 'after search the cursor should be on the first match')
  t.comment('cycling through matches')
  for (let i = 0; i < count - 1; i++) {
    _next()
  }
  t.equal(state.cursor, count - 1, 'cursor should be on last')
  t.ok(_next(), 'another next() should not be a problem')
  t.comment('cycling backwards')
  for (let i = 0; i < count - 1; i++) {
    _previous()
  }
  t.equal(state.cursor, 0, 'cursor should be on the first match again')
  t.ok(_previous(), 'another previous() should not be a problem')
  t.end()
})

test('FindAndReplace: updating search results when text is changed', t => {
  let { editor } = _setup(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(editor)
  let input = fnrDialog.find('.sm-find input')
  input.val('Lorem')
  input.el.emit('input')
  let state = fnrManager._getState()
  let origCount = state.count

  t.comment('inserting text')
  setCursor(editor, 'p-1.content', 2)
  // this should invalidate the first match on p-1
  insertText(editor, 'xxx')
  t.equal(fnrManager._getState().count, origCount - 1, 'one match should have been invalidated')

  t.comment('undoing the change')
  clickUndo(editor)
  t.equal(fnrManager._getState().count, origCount, 'match should be back again')

  t.comment('deleting text')
  setSelection(editor, 'p-1.content', 0, 5)
  deleteSelection(editor)
  t.equal(fnrManager._getState().count, origCount - 1, 'one match should have been invalidated')

  t.comment('undoing the change')
  clickUndo(editor)
  t.equal(fnrManager._getState().count, origCount, 'match should be back again')

  t.end()
})

function _setup (t, fixture) {
  let { app } = setupTestApp(t, fixture)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
  return { app, editor }
}

function _openFindAndReplaceDialog (editor, replace) {
  // open findAndReplace dialog
  let fnrManager = editor.context.findAndReplaceManager
  fnrManager.openDialog(replace)
  let fnrDialog = editor.find('.sc-find-and-replace-dialog')
  return { fnrManager, fnrDialog }
}

function _closeFindAndReplaceDialog (editor) {
  let fnrManager = editor.context.findAndReplaceManager
  fnrManager.closeDialog()
}
