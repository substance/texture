import { test } from 'substance-test'
import { setCursor, LOREM_IPSUM, getDocument } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: instead of the kitchen-sink we should use a fixture that has a defined content
// so that we can write proper test assertions

test('FindAndReplace: open find dialog', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let { fnrDialog } = _openFindAndReplaceDialog(app)
  t.notNil(fnrDialog, 'The dialog should be rendered')
  t.notOk(fnrDialog.hasClass('sm-hidden'), '.. and should be visible')
  t.end()
})

test('FindAndReplace: simple search', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(app)
  let input = fnrDialog.find('.sm-find input')
  input.val('Lorem')
  input.el.emit('input')
  let state = fnrManager._getState()
  t.equal(state.count, 19, 'The number of case-insensitive matches should be correct')
  t.end()
})

test('FindAndReplace: clear search pattern', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let { fnrDialog, fnrManager } = _openFindAndReplaceDialog(app)
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
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let { editor, fnrDialog, fnrManager } = _openFindAndReplaceDialog(app, true)
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
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let { editor, fnrDialog, fnrManager } = _openFindAndReplaceDialog(app, true)
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

function _openFindAndReplaceDialog (app, replace) {
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'manuscript')
  let editor = articlePanel.find('.sc-manuscript-editor')
  setCursor(editor, 'p-2.content', 290)
  // open findAndReplace dialog
  let fnrManager = editor.context.findAndReplaceManager
  fnrManager.openDialog(replace)
  let fnrDialog = editor.find('.sc-find-and-replace-dialog')
  return { editor, fnrManager, fnrDialog }
}
