import { test } from 'substance-test'
import { setCursor, openManuscriptEditor, PseudoFileEvent, loadBodyFixture, getDocument, openMetadataEditor } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { getLabel } from '../index'

const FIGURE_WITH_TWO_PANELS = `
<fig-group id="fig1">
  <fig id="fig1a">
    <graphic />
    <caption>
      <p id="fig1a-caption-p1"></p>
    </caption>
  </fig>
  <fig id="fig1b">
    <graphic />
    <caption>
      <p id="fig1b-caption-p1"></p>
    </caption>
  </fig>
</fig-group>
`

test('Figure: open figure with sub-figures in manuscript and metadata view', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)
  t.notNil(editor.find('.sc-figure[data-id=fig1]'), 'figure should be displayed in manuscript view')
  editor = openMetadataEditor(app)
  let subFigureCards = editor.findAll('.sc-card.sm-figure-panel')
  t.equal(subFigureCards.length, 2, 'there should be a card for each panel in metadata view')
  t.end()
})

test('Figure: add figure into manuscript', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, '<p id="p1">ABC</p>')
  setCursor(editor, 'p1.content', 3)
  // ATTENTION: it is not possible to trigger the file-dialog programmatically
  // instead we are just checking that this does not throw
  let insertFigureTool = editor.find('.sc-insert-figure-tool')
  t.ok(insertFigureTool.find('button').click(), 'clicking on the insert figure button should not throw error')
  // ... and then triggering onFileSelect() directly
  insertFigureTool.onFileSelect(new PseudoFileEvent())
  let afterP = editor.find('*[data-id=p1] + *')
  t.ok(afterP.hasClass('sm-figure'), 'element after p-2 should be a figure now')
  // TODO: we should test the automatic labeling
  t.end()
})

const SIMPLE_FIGURE = `
<fig id="fig1">
  <graphic />
  <caption>
    <p id="fig1-caption-p1"></p>
  </caption>
</fig>
`

test('Figure: add a sub-figure to a figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_FIGURE)
  let doc = getDocument(editor)
  let figure = doc.find('body figure')
  setCursor(editor, 'fig1-caption-p1.content', 0)
  let insertFigurePanelTool = editor.find('.sc-upload-figure-panel-tool')
  t.ok(insertFigurePanelTool.find('button').click(), 'clicking on the insert figure panel button should not throw error')
  insertFigurePanelTool.onFileSelect(new PseudoFileEvent())
  let panels = figure.getPanels()
  t.equal(panels.length, 2, 'figure should have 2 panels now')
  t.deepEqual(panels.map(getLabel), ['Figure 1A', 'Figure 1B'], '.. with correct labels')
  t.end()
})

test('Figure: remove a sub-figure from a figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)
  let doc = getDocument(editor)
  let figure = doc.get('fig1')

  // click on the preview of fig1b to make it the current panel
  editor.find('.se-carousel .sc-figure-panel[data-id=fig1b]').click()
  setCursor(editor, 'fig1b-caption-p1.content', 0)

  let removePanelTool = editor.find('.sc-toggle-tool.sm-remove-figure-panel')
  t.notNil(removePanelTool, 'tool for removing panel should be visible')
  t.ok(removePanelTool.find('button').click(), 'clicking on the tool should not throw error')
  let panels = figure.getPanels()
  t.equal(panels.length, 1, 'figure should have only one panel left')
  t.deepEqual(panels.map(getLabel), ['Figure 1'], '.. with correct label')
  t.end()
})
