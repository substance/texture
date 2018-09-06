/* global Blob */
import { platform } from 'substance'
import { test } from 'substance-test'
import { setCursor } from './integrationTestHelpers'
import setupTestApp from './setupTestApp'

test('ManuscriptEditor: add figure', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'manuscript')
  let editor = articlePanel.find('.sc-manuscript-editor')
  setCursor(editor, 'p-2.content', 290)
  // ATTENTION: it is not possible to trigger the file-dialog programmatically
  // instead we are just checking that this does not throw
  let insertFigureTool = articlePanel.find('.sc-insert-figure-tool')
  t.ok(insertFigureTool.find('button').click(), 'clicking on the insert figure button should not throw')
  // ... and then triggering onFileSelect() directly
  insertFigureTool.onFileSelect(new PseudoFileEvent())
  let afterP2 = editor.find('*[data-id=p-2] + *')
  t.ok(afterP2.hasClass('sm-figure'), 'element after p-2 should be a figure now')
  // TODO: we should test the automatic labeling
  t.end()
})

test('ManuscriptEditor: TOC should be updated on change', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'manuscript')
  let editor = articlePanel.find('.sc-manuscript-editor')
  let toc = editor.find('.sc-toc')
  editor.context.editorSession.transaction(tx => {
    tx.set(['heading-1', 'content'], 'TEST')
  })
  let h1 = toc.find('*[data-id="heading-1"]')
  t.equal(h1.el.text(), 'TEST', 'TOC entry should have been updated')
  t.end()
})

class PseudoFileEvent {
  constructor () {
    let blob
    if (platform.inBrowser) {
      blob = new Blob(['abc'], {type: 'image/png'})
      blob.name = 'test.png'
    // FIXME: do something real in NodeJS
    } else {
      blob = { name: 'test.png', type: 'image/png' }
    }
    this.currentTarget = {
      files: [ blob ]
    }
  }
}
