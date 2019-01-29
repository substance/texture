import { test } from 'substance-test'
import {
  setCursor, openManuscriptEditor, PseudoFileEvent,
  loadBodyFixture, getDocument, openMetadataEditor, getEditorSession, clickUndo,
  deleteSelection, openMenuAndFindTool, isToolEnabled, selectNode
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { getLabel } from '../index'
import { doesNotThrowInNodejs } from './shared/testHelpers'

// TODO: test automatic labelling

const insertFigureSelector = '.sc-insert-figure-tool'
const insertFigureXrefSelector = '.sm-insert-xref-figure'
const insertFigurePanelSelector = '.sc-insert-figure-panel-tool'
const moveUpToolSelector = '.sm-move-up-figure-panel'
const moveDownToolSelector = '.sm-move-down-figure-panel'
const openPanelImageSelector = '.sc-open-figure-panel-source-tool'
const removePanelToolSelector = '.sm-remove-figure-panel'
const replacePanelToolSelector = '.sc-replace-figure-panel-tool'
const subFigureCardSelector = '.sc-card.sm-figure-panel'
const xrefSelector = '.sc-xref.sm-fig'
const xrefListItemSelector = '.sc-edit-xref-tool .se-option .sc-preview'
const figurePanelPreviousSelector = '.sc-figure .se-control.sm-previous'
const figurePanelNextSelector = '.sc-figure .se-control.sm-next'
const currentPanelSelector = '.sc-figure .se-current-panel .sc-figure-panel'

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
  const insertFigureTool = openMenuAndFindTool(editor, 'insert', insertFigureSelector)
  t.ok(insertFigureTool.el.click(), 'clicking on the insert figure button should not throw error')
  // ... and then triggering onFileSelect() directly
  insertFigureTool.onFileSelect(new PseudoFileEvent())
  let afterP = editor.find('*[data-id=p1] + *')
  t.ok(afterP.hasClass('sm-figure'), 'element after p-2 should be a figure now')
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
  const insertFigurePanelTool = openMenuAndFindTool(editor, 'figure-tools', insertFigurePanelSelector)
  t.ok(insertFigurePanelTool.el.click(), 'clicking on the insert figure panel button should not throw error')
  insertFigurePanelTool.onFileSelect(new PseudoFileEvent())
  let panels = figure.panels.map(id => doc.get(id))
  t.equal(panels.length, 2, 'figure should have 2 panels now')
  t.deepEqual(panels.map(getLabel), ['Figure 1A', 'Figure 1B'], '.. with correct labels')
  t.end()
})

test('Figure: remove a sub-figure from a figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)

  let figure = doc.get('fig1')
  let secondPanel = doc.get(figure.panels[1])
  let p = doc.get(secondPanel.legend[0])
  _selectFigurePanel(editor, figure, 1)
  setCursor(editor, p.getPath(), 0)
  t.ok(_removeFigurePanel(editor), 'clicking on the tool should not throw error')
  let panels = figure.panels.map(id => doc.get(id))
  t.equal(panels.length, 1, 'figure should have only one panel left')
  t.deepEqual(panels.map(getLabel), ['Figure 1'], '.. with correct label')
  // TODO: test a selection, it should be on the other sub-figure
  t.end()
})

test('Figure: remove a figure with multiple panels', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)

  const _figureIsVisible = () => Boolean(editor.find('.sc-figure[data-id=fig1]'))
  const _hasFigure = () => Boolean(doc.get('fig1'))
  const _getPanelCount = () => doc.get(['fig1', 'panels']).length

  t.ok(_figureIsVisible(), 'figure should be displayed in manuscript view')
  t.ok(_hasFigure(), 'there should be fig-1 node in document')

  selectNode(editor, 'fig1')
  deleteSelection(editor)

  t.notOk(_figureIsVisible(), 'figure should not be displayed in manuscript view anymore')
  t.notOk(_hasFigure(), 'there should be no node with fig-1 id in document')

  doesNotThrowInNodejs(t, () => {
    clickUndo(editor)
  }, 'using "Undo" should not throw')

  t.ok(_figureIsVisible(), 'figure should be again in manuscript view')
  t.ok(_hasFigure(), 'figure should be again in document')
  t.equal(_getPanelCount(), 2, 'figure should have 2 sub-figures')
  t.end()
})

const FIGURE_WITH_THREE_PANELS = `
<fig-group id="fig1">
  <fig id="fig1a">
    <graphic />
    <caption>
      <p id="fig1a-caption-p1">A</p>
    </caption>
  </fig>
  <fig id="fig1b">
    <graphic />
    <caption>
      <p id="fig1b-caption-p1">B</p>
    </caption>
  </fig>
  <fig id="fig1c">
    <graphic />
    <caption>
      <p id="fig1c-caption-p1">C</p>
    </caption>
  </fig>
</fig-group>
`

test('Figure: change the order of panels in manuscript', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_THREE_PANELS)

  const doc = getDocument(editor)
  const figure = doc.get('fig1')
  const [panel1Id, panel2Id, panel3Id] = figure.panels.slice()
  const subFigure1Label = 'Figure 1A'
  const subFigure2Label = 'Figure 1B'
  const subFigure3Label = 'Figure 1C'
  const labels = [subFigure1Label, subFigure2Label, subFigure3Label]
  const _getSubFigureLabels = () => figure.resolve('panels').map(getLabel)
  const _selectSubFigure = (idx) => _selectFigurePanel(editor, figure, idx)
  const _canMoveUp = () => _isToolEnabled(editor, moveUpToolSelector)
  const _canMoveDown = () => _isToolEnabled(editor, moveDownToolSelector)
  const _moveUp = () => openMenuAndFindTool(editor, 'figure-tools', moveUpToolSelector).click()
  const _moveDown = () => openMenuAndFindTool(editor, 'figure-tools', moveDownToolSelector).click()

  t.comment('when figure is not selected')
  t.notOk(_canMoveUp(), 'move up tool shoold not be available')
  t.notOk(_canMoveDown(), 'move down tool shoold not be available')

  // navigating to different sub-figures to test tools availability

  t.comment('when the first panel is selected')
  _selectSubFigure(0)
  t.equal(_getDisplayedPanelId(editor), panel1Id, 'correct panel should be displayed')
  t.notOk(_canMoveUp(), 'move up tool should not be available')
  t.ok(_canMoveDown(), 'move down tool should be available')

  t.comment('when the second panel is selected')
  _selectSubFigure(1)
  t.equal(_getDisplayedPanelId(editor), panel2Id, 'correct panel should be displayed')
  t.ok(_canMoveUp(), 'move up tool should be available')
  t.ok(_canMoveDown(), 'move down tool should be available')

  t.comment('when the last panel is selected')
  _selectSubFigure(2)
  t.equal(_getDisplayedPanelId(editor), panel3Id, 'correct panel should be displayed')
  t.ok(_canMoveUp(), 'move up tool should be available')
  t.notOk(_canMoveDown(), 'move down tool should not be available')

  // move down twice and check tool availability, selections, ids and labels
  t.comment('moving the last panel up')
  _selectSubFigure(2)
  doesNotThrowInNodejs(t, () => {
    _moveUp()
  }, 'move up should not throw')
  t.deepEqual(figure.panels, [panel1Id, panel3Id, panel2Id], 'sub-figures id should match')
  t.deepEqual(_getSubFigureLabels(), labels, 'sub-figures labels should be updated')
  t.equal(_getDisplayedPanelId(editor), panel3Id, 'selection should move, with sub-figure')

  t.comment('moving the same up again')
  doesNotThrowInNodejs(t, () => {
    _moveUp()
  }, 'move up should not throw')
  t.deepEqual(figure.panels, [panel3Id, panel1Id, panel2Id], 'sub-figures id should match')
  t.deepEqual(_getSubFigureLabels(), labels, 'sub-figures labels should be updated')
  t.equal(_getDisplayedPanelId(editor), panel3Id, 'selection should move, with sub-figure')

  t.comment('moving down the second panel')
  _selectSubFigure(1)
  doesNotThrowInNodejs(t, () => {
    _moveDown()
  }, 'move down should not throw')
  t.deepEqual(figure.panels, [panel3Id, panel2Id, panel1Id], 'sub-figures id should match')
  t.deepEqual(_getSubFigureLabels(), labels, 'sub-figures labels should be updated')
  t.equal(_getDisplayedPanelId(editor), panel1Id, 'selection should move, with sub-figure')

  t.end()
})

test('Figure: using panel navigation', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, FIGURE_WITH_THREE_PANELS)

  const figure = doc.get('fig1')
  const _canGotoPrevious = () => !(editor.find(figurePanelPreviousSelector).el.hasClass('sm-disabled'))
  const _gotoPrevious = () => editor.find(figurePanelPreviousSelector).el.click()
  const _canGotoNext = () => !(editor.find(figurePanelNextSelector).el.hasClass('sm-disabled'))
  const _gotoNext = () => editor.find(figurePanelNextSelector).el.click()

  t.comment('with first panel selected')
  _selectFigurePanel(editor, figure, 0)
  t.equal(_getDisplayedPanelId(editor), figure.panels[0], 'correct panel should be displayed')
  t.notOk(_canGotoPrevious(), 'should not allow to go to previous panel')
  t.ok(_canGotoNext(), 'should allow to go to next panel')

  t.comment('open next panel')
  _gotoNext()
  t.equal(_getDisplayedPanelId(editor), figure.panels[1], 'correct panel should be displayed')
  t.ok(_canGotoPrevious(), 'should allow to go to previous panel')
  t.ok(_canGotoNext(), 'should allow to go to next panel')

  t.comment('open last panel')
  _gotoNext()
  t.equal(_getDisplayedPanelId(editor), figure.panels[2], 'correct panel should be displayed')
  t.ok(_canGotoPrevious(), 'should allow to go to previous panel')
  t.notOk(_canGotoNext(), 'should not allow to go to next panel')

  t.comment('going back to previous panel')
  _gotoPrevious()
  t.equal(_getDisplayedPanelId(editor), figure.panels[1], 'correct panel should be displayed')
  t.ok(_canGotoPrevious(), 'should allow to go to previous panel')
  t.ok(_canGotoNext(), 'should allow to go to next panel')

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
  const doc = getDocument(editor)
  const figure = doc.get('fig1')

  const emptyLabel = '???'
  const _createFigureRef = () => openMenuAndFindTool(editor, 'insert', insertFigureXrefSelector).click()
  const _getXref = () => editor.find(xrefSelector)
  const _selectXref = (xref) => xref.el.click()
  const _selectFirstTarget = () => {
    const firstXref = editor.find('.sc-edit-xref-tool .se-option .sc-preview')
    firstXref.click()
  }
  const _selectFirstSubFigure = () => _selectFigurePanel(editor, figure, 0)
  const _removePanel = () => openMenuAndFindTool(editor, 'figure-tools', removePanelToolSelector).click()

  setCursor(editor, 'p1.content', 2)
  t.isNil(editor.find(xrefSelector), 'there should be no references in manuscript')
  _createFigureRef()
  t.isNotNil(_getXref(), 'there should be reference in manuscript')
  t.equal(_getXref().text(), emptyLabel, 'xref label should not contain reference')

  _selectXref(_getXref())
  _selectFirstTarget()
  t.equal(_getXref().text(), 'Figure 1A', 'xref label should be equal to xref label')

  _selectFirstSubFigure()
  _removePanel()
  t.equal(_getXref().text(), emptyLabel, 'xref label should not contain reference again')
  t.end()
})

test('Figure: reference multiple sub-figures', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, PARAGRAPH_WITH_MULTIPANELFIGURE)

  const doc = getDocument(editor)
  const figure = doc.get('fig1')
  const getXref = () => editor.find(xrefSelector)
  const getXrefListItems = () => editor.findAll(xrefListItemSelector)

  // inserting an xref using the edit xref dropdown and selecting two panels
  setCursor(editor, 'p1.content', 2)
  openMenuAndFindTool(editor, 'insert', insertFigureXrefSelector).click()
  editor.find(xrefSelector).click()
  getXrefListItems()[0].click()
  getXrefListItems()[1].click()
  t.equal(getXref().text(), 'Figures 1A‒B', 'xref label should be Figure 1A-B')

  _selectFigurePanel(editor, figure, 0)
  const removePanelTool = openMenuAndFindTool(editor, 'figure-tools', removePanelToolSelector)
  t.ok(removePanelTool.click(), 'clicking on remove sub-figure tool should not throw error')
  t.equal(getXref().text(), 'Figure 1', 'xref label should be equal to xref label')
  t.end()
})

test('Figure: open image from figure panel', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)
  const _canOpen = () => _isToolEnabled(editor, openPanelImageSelector)
  const _openImage = () => openMenuAndFindTool(editor, 'figure-tools', openPanelImageSelector).click()

  t.notOk(_canOpen(), 'open image tool should be disabled by default')

  let editorSession = getEditorSession(editor)
  editorSession.setSelection({
    type: 'node',
    nodeId: 'fig1',
    surfaceId: 'body',
    containerPath: ['body', 'content']
  })

  t.ok(_canOpen(), 'open image tool should be active when selection is on figure node')
  doesNotThrowInNodejs(t, () => {
    _openImage()
  }, 'open image tool should not throw')
  t.end()
})

test('Figure: replace image in figure panel', t => {
  // TODO: we should test image upload better in the future with inspecting an asset
  // that requires some improvements on archive level
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)

  const doc = getDocument(editor)
  const figure = doc.get('fig1')

  _selectFigurePanel(editor, figure, 0)
  // Note: we have the same tool for replace as for add a new sub-figure
  let replaceSubFigureImageTool = openMenuAndFindTool(editor, 'figure-tools', replacePanelToolSelector)
  t.ok(_isToolEnabled(editor, replacePanelToolSelector), 'replace sub-figure image tool should be available')
  t.ok(replaceSubFigureImageTool.click(), 'clicking on the replace sub-figure button should not throw error')
  // triggering onFileSelect() so that the figure replace logic gets called
  // TODO: if we had a way to retrieve stats for the assets, we could improve this test
  doesNotThrowInNodejs(t, () => {
    replaceSubFigureImageTool.onFileSelect(new PseudoFileEvent())
  }, 'triggering file upload for replace sub-figure should not throw')

  t.end()
})

test('Figure: remove and move figure panels in metadata view', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  // TODO: MetadataEditor is not updating when loading the fixture
  // after opening the view. It would be better to have an 'editorSession' just for
  // the loading, and then open the Metadata view. But the editor session is currently
  // bound to the views.
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, FIGURE_WITH_THREE_PANELS)

  // Helpers
  const getSubFigureCards = () => editor.findAll(subFigureCardSelector)
  const getSubFigureLabel = (card) => card.find(`.sc-figure-metadata .se-label`).text()
  const getSubFigureId = (card) => card.getAttribute('data-id')
  const selectCard = (card) => card.click()
  const moveUpCard = () => openMenuAndFindTool(editor, 'figure-tools', moveUpToolSelector).click()
  const removeCard = () => openMenuAndFindTool(editor, 'figure-tools', removePanelToolSelector).click()
  const isMoveUpPossible = () => _isToolEnabled(editor, moveUpToolSelector)
  const isRemovePossible = () => _isToolEnabled(editor, removePanelToolSelector)

  editor = openMetadataEditor(app)

  // checking that there is a card for every panel
  let expectedNumberOfCards = doc.findAll('figure').reduce((n, fig) => n + fig.panels.length, 0)
  let cards = getSubFigureCards()
  t.equal(cards.length, expectedNumberOfCards, 'there should a card for each panel in the metadata view')
  // ... contextual tools should be disabled without selecting panel
  t.notOk(isMoveUpPossible(), 'move up sub-figure tool should be unavailable by default')
  t.notOk(isRemovePossible(), 'remove sub-figure tool should be unavailable by default')

  // selecting a card should activate contextual tools
  selectCard(cards[1])
  t.ok(isMoveUpPossible(), 'move up sub-figure tool should be available when panel card is selected')
  t.ok(isRemovePossible(), 'remove sub-figure tool should be available when panel card is selected')

  // removing selected panel should remove card and update label
  removeCard()
  cards = getSubFigureCards()
  t.equal(cards.length, expectedNumberOfCards - 1, 'one panel card should have been removed')
  t.equal(getSubFigureId(cards[1]), 'fig1c', 'second sub-figure id should match')
  // ATTENTION: the label has changed, so data-id and label do not fit together well anymore
  t.equal(getSubFigureLabel(cards[1]), 'Figure 1B', 'second sub-figure label should match')

  // moving up a sub-figure to the top should move the panel, update the label, and disable move-up tool
  selectCard(cards[1])
  moveUpCard()
  cards = getSubFigureCards()
  t.equal(getSubFigureId(cards[0]), 'fig1c', 'first card should be the moved one')
  t.equal(getSubFigureLabel(cards[0]), 'Figure 1A', 'sub-figure label should have been updated')
  t.notOk(isMoveUpPossible(), 'move up sub-figure tool should be unavailable')
  t.end()
})

function _selectFigurePanel (editor, figure, panelIndex) {
  let editorSession = getEditorSession(editor)
  editorSession.updateNodeStates([[figure.id, { currentPanelIndex: panelIndex }]])
  selectNode(editor, figure.id)
}

function _removeFigurePanel (editor) {
  let tool = openMenuAndFindTool(editor, 'figure-tools', removePanelToolSelector)
  return tool.click()
}

function _isToolEnabled (editor, toolClass) {
  return isToolEnabled(editor, 'figure-tools', toolClass)
}

function _getDisplayedPanelId (editor) {
  return editor.find(currentPanelSelector).getAttribute('data-id')
}
