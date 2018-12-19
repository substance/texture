import { test } from 'substance-test'
import {
  setCursor, openManuscriptEditor, PseudoFileEvent,
  loadBodyFixture, getDocument, openMetadataEditor, getEditorSession
} from './shared/integrationTestHelpers'
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
  // TODO: test a selection, it should be on the other sub-figure
  t.end()
})

test('Figure: remove a figure with multiple panels', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  let editorSession = getEditorSession(editor)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)
  t.notNil(editor.find('.sc-figure[data-id=fig1]'), 'figure should be displayed in manuscript view')
  t.notNil(doc.get('fig1'), 'there should be fig-1 node in document')
  editorSession.setSelection({
    type: 'node',
    nodeId: 'fig1',
    surfaceId: 'body',
    containerId: 'body'
  })
  editorSession.transaction((tx) => {
    tx.deleteSelection()
  })
  t.isNil(editor.find('.sc-figure[data-id=fig1]'), 'figure should not be displayed in manuscript view anymore')
  t.isNil(doc.get('fig1'), 'there should be no node with fig-1 id in document')
  // undo a multipanel figure removing
  t.doesNotThrow(() => {
    editor.find('.sc-toggle-tool.sm-undo > button').el.click()
  }, 'using "Undo" should not throw')
  t.notNil(editor.find('.sc-figure[data-id=fig1]'), 'figure should be again in manuscript view')
  const figureNode = doc.get('fig1')
  t.notNil(figureNode, 'figure should be again in document')
  t.equal(figureNode.getPanels().length, 2, 'figure should have 2 sub-figures')
  t.end()
})

const FIGURE_WITH_THREE_PANELS = `
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
  <fig id="fig1c">
    <graphic />
    <caption>
      <p id="fig1c-caption-p1"></p>
    </caption>
  </fig>
</fig-group>
`

test('Figure: change the order of panels in manuscript', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_THREE_PANELS)
  const subFigure3Id = 'fig1c'
  const subFigure3Label = 'Figure 1C'
  const subFigure2Id = 'fig1b'
  const subFigure2Label = 'Figure 1B'
  const subFigure1Id = 'fig1a'
  const moveUpToolSelector = '.sc-toggle-tool.sm-move-up-figure-panel'
  const moveDownToolSelector = '.sc-toggle-tool.sm-move-down-figure-panel'
  const subFigureSelector = '.sc-figure .se-thumbnails > .sc-figure-panel'
  const activeSubFigureSelector = subFigureSelector + '.sm-current-panel'
  const getSubFigures = () => editor.findAll(subFigureSelector)
  const getSelectedSubFigureId = () => editor.find(activeSubFigureSelector).getAttribute('data-id')
  const subFigures = getSubFigures()
  t.equal(subFigures.length, 3, 'figure with three sub-figures should be displayed in manuscript view')
  t.isNil(editor.find(moveUpToolSelector), 'move up sub-figure tool shoold be unavailable by default')
  t.isNil(editor.find(moveDownToolSelector), 'move down sub-figure tool shoold be unavailable by default')
  // click on different sub-figures to test tools availability
  getSubFigures()[0].el.click()
  t.equal(getSelectedSubFigureId(), subFigure1Id, 'first sub-figure should be visually selected')
  t.isNil(editor.find(moveUpToolSelector), 'move up sub-figure tool shoold not be unavailable for a first sub-figure')
  t.isNotNil(editor.find(moveDownToolSelector), 'move down sub-figure tool shoold be available for a first sub-figure')
  getSubFigures()[1].el.click()
  t.equal(getSelectedSubFigureId(), subFigure2Id, 'second sub-figure should be visually selected')
  t.isNotNil(editor.find(moveUpToolSelector), 'move up sub-figure tool shoold be available for a second sub-figure')
  t.isNotNil(editor.find(moveDownToolSelector), 'move down sub-figure tool shoold be available for a second sub-figure')
  getSubFigures()[2].el.click()
  t.equal(getSelectedSubFigureId(), subFigure3Id, 'third sub-figure should be visually selected')
  t.isNotNil(editor.find(moveUpToolSelector), 'move up sub-figure tool shoold be available for a third sub-figure')
  t.isNil(editor.find(moveDownToolSelector), 'move down sub-figure tool shoold not be available for a third sub-figure')
  // move down twice and check tool availability, selections, ids and labels
  t.equal(getSubFigures()[2].getAttribute('data-id'), subFigure3Id, 'sub-figures id should match')
  t.equal(getSubFigures()[2].find('.se-label').text(), subFigure3Label, 'sub-figure label should match')
  t.doesNotThrow(() => {
    editor.find(moveUpToolSelector + ' button').el.click()
  }, 'using move up should not throw')
  t.equal(getSelectedSubFigureId(), subFigure3Id, 'selection should move, with sub-figure')
  t.isNotNil(editor.find(moveUpToolSelector), 'move down sub-figure tool shoold be available now')
  // id should change, labels should stay, selection should move
  t.equal(getSubFigures()[2].getAttribute('data-id'), subFigure2Id, 'third sub-figure id should change to second one')
  t.equal(getSubFigures()[2].find('.se-label').text(), subFigure3Label, 'third sub-figure label should not change')
  t.equal(getSubFigures()[1].getAttribute('data-id'), subFigure3Id, 'second sub-figure id should change to third one')
  t.equal(getSubFigures()[1].find('.se-label').text(), subFigure2Label, 'second sub-figure label should not change')
  t.doesNotThrow(() => {
    editor.find(moveUpToolSelector + ' button').el.click()
  }, 'using move up should not throw')
  t.isNil(editor.find(moveUpToolSelector), 'move up sub-figure tool shoold be unavailable now')
  t.equal(getSubFigures()[1].getAttribute('data-id'), subFigure1Id, 'second sub-figure id should change to first one')
  t.equal(getSubFigures()[0].getAttribute('data-id'), subFigure3Id, 'first sub-figure id should change to third one')
  // undo a multipanel figure removing
  t.doesNotThrow(() => {
    editor.find('.sc-toggle-tool.sm-undo > button').el.click()
  }, 'using "Undo" should not throw')
  t.equal(getSubFigures()[2].getAttribute('data-id'), subFigure2Id, 'after undo third sub-figure id should be again equals to second one')
  t.equal(getSelectedSubFigureId(), subFigure3Id, 'selection should stay the same')
  t.isNotNil(editor.find(moveUpToolSelector), 'move up sub-figure tool shoold be again available')
  t.doesNotThrow(() => {
    editor.find(moveDownToolSelector + ' button').el.click()
  }, 'using move down should not throw')
  t.isNil(editor.find(moveDownToolSelector), 'move down sub-figure tool shoold not be available now')
  t.equal(getSubFigures()[2].getAttribute('data-id'), subFigure3Id, 'after moving down third sub-figure id should be original again')
  t.end()
})

const PARAGRAPH_WITH_MULTIPANELFIGURE = `
<p id="p1">ABC</p>
${FIGURE_WITH_TWO_PANELS}
`

test('Figure: reference a sub-figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, PARAGRAPH_WITH_MULTIPANELFIGURE)
  setCursor(editor, 'p1.content', 2)
  const xrefSelector = '.sc-inline-node .sm-fig'
  const removeSubFigureToolSelector = '.sc-toggle-tool.sm-remove-figure-panel button'
  const emptyLabel = '???'

  t.isNil(editor.find(xrefSelector), 'there should be no references in manuscript')
  let citeMenu = editor.find('.sc-tool-dropdown.sm-cite button')
  citeMenu.click()
  let insertFigureRef = editor.find('.sc-menu-item.sm-insert-xref-fig')
  insertFigureRef.click()

  const getXref = () => editor.find(xrefSelector)
  t.isNotNil(getXref(), 'there should be reference in manuscript')
  t.equal(getXref().text(), emptyLabel, 'xref label should not contain reference')

  editor.find(xrefSelector).click()
  const firstXref = editor.find('.sc-edit-xref-tool .se-option .sc-preview')
  firstXref.click()
  t.equal(getXref().text(), 'Figure 1A', 'xref label should be equal to xref label')

  const firstThumbnail = editor.find('.sc-figure .se-thumbnails > .sc-figure-panel')
  firstThumbnail.click()
  const removeSubFigureTool = editor.find(removeSubFigureToolSelector)
  removeSubFigureTool.click()
  t.equal(getXref().text(), emptyLabel, 'xref label should not contain reference again')
  t.end()
})

test('Figure: reference multiple sub-figures', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, PARAGRAPH_WITH_MULTIPANELFIGURE)
  setCursor(editor, 'p1.content', 2)
  const xrefSelector = '.sc-inline-node .sm-fig'
  const getXref = () => editor.find(xrefSelector)
  const xrefListItem = '.sc-edit-xref-tool .se-option .sc-preview'
  const removeSubFigureToolSelector = '.sc-toggle-tool.sm-remove-figure-panel button'
  const getXrefListItems = () => editor.findAll(xrefListItem)

  let citeMenu = editor.find('.sc-tool-dropdown.sm-cite button')
  citeMenu.click()
  let insertFigureRef = editor.find('.sc-menu-item.sm-insert-xref-fig')
  insertFigureRef.click()

  editor.find(xrefSelector).click()
  getXrefListItems()[0].click()
  getXrefListItems()[1].click()
  t.equal(getXref().text(), 'Figures 1A‒B', 'xref label should be Figure 1A-B')

  const firstThumbnail = editor.find('.sc-figure .se-thumbnails > .sc-figure-panel')
  firstThumbnail.click()
  const removeSubFigureTool = editor.find(removeSubFigureToolSelector)
  removeSubFigureTool.click()
  t.equal(getXref().text(), 'Figure 1', 'xref label should be equal to xref label')
  t.end()
})

test('Figure: replace image in figure panel', t => {
  // TODO: we should test image upload better in the future with inspecting an asset
  // that requires some improvements on archive level
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)
  const uploadSubFigureToolSelector = '.sc-upload-figure-panel-tool.sm-upload-tool button'
  const firstThumbnail = editor.find('.sc-figure .se-thumbnails > .sc-figure-panel')
  firstThumbnail.click()
  // Note: we have the same tool for replace as for add a new sub-figure
  const replaceSubFigureImageTool = editor.findAll(uploadSubFigureToolSelector)[1]
  t.isNotNil(replaceSubFigureImageTool, 'replace sub-figure image tool shoold be available')
  t.ok(replaceSubFigureImageTool.click(), 'clicking on the replace sub-figure button should not throw error')
  t.end()
})
