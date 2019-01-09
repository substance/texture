import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, setSelection, insertText } from './shared/integrationTestHelpers'

test(`EditReference: add and edit authors`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  _addReference(editor, 'journal-article-ref')
  let card = editor.find('.sc-card.sm-journal-article-ref')
  card.find('.sm-authors .se-add-value').el.click()
  let refContribEl = card.find('.sm-authors .sm-ref-contrib')
  let refContribId = refContribEl.attr('data-id')
  setSelection(editor, [refContribId, 'name'], 0)
  insertText(editor, 'Doe')
  setSelection(editor, [refContribId, 'givenNames'], 0)
  insertText(editor, 'John')
  // this is very style specific
  // TODO: is there a better way to test the effect of editing?
  let previewText = card.find('.sc-model-preview').text()
  t.ok(previewText.search('Doe') > -1, 'preview should display surname of author')
  t.end()
})

function _addReference (editor, bibrType) {
  let menu = editor.find('.sc-tool-dropdown.sm-add')
  menu.find('button').el.click()
  menu.find(`.sc-menu-item.sm-add-reference`).el.click()
  editor.find(`.sc-modal-dialog .se-add-reference .se-type.sm-${bibrType}`).click()
}
