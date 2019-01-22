import { test } from 'substance-test'
import {
  setCursor, openManuscriptEditor, PseudoFileEvent,
  loadBodyFixture, getDocument, openMetadataEditor, getEditorSession, clickUndo,
  deleteSelection, openMenuAndFindTool, isToolEnabled
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
const removePanelToolSelector = '.sm-remove-figure-panel'
const replacePanelToolSelector = '.sc-replace-figure-panel-tool'
const subFigureCardSelector = '.sc-card.sm-figure-panel'

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
  _selectFigurePanel(editor, secondPanel)
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

  let editorSession = getEditorSession(editor)
  editorSession.setSelection({
    type: 'node',
    nodeId: 'fig1',
    surfaceId: 'body',
    containerPath: ['body', 'content']
  })
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
  const subFigure3Id = 'fig1c'
  const subFigure3Label = 'Figure 1C'
  const subFigure2Id = 'fig1b'
  const subFigure2Label = 'Figure 1B'
  const subFigure1Id = 'fig1a'
  const subFigure1Label = 'Figure 1A'
  const labels = [subFigure1Label, subFigure2Label, subFigure3Label]
  const subFigureSelector = '.sc-figure .se-thumbnails > .sc-figure-panel'
  const activeSubFigureSelector = subFigureSelector + '.sm-current-panel'
  const _getSubFigures = () => editor.findAll(subFigureSelector)
  const _getSubFigureIds = () => _getSubFigures().map(f => f.getAttribute('data-id'))
  const _getSubFigureLabels = () => _getSubFigures().map(f => f.find('.se-label').text())
  const _getSelectedSubFigureId = () => editor.find(activeSubFigureSelector).getAttribute('data-id')
  const _selectSubFigure = (idx) => _getSubFigures()[idx].el.click()
  const _canMoveUp = () => _isToolEnabled(editor, moveUpToolSelector)
  const _canMoveDown = () => _isToolEnabled(editor, moveDownToolSelector)
  const _moveUp = () => openMenuAndFindTool(editor, 'figure-tools', moveUpToolSelector).click()
  const _moveDown = () => openMenuAndFindTool(editor, 'figure-tools', moveDownToolSelector).click()

  t.equal(_getSubFigures().length, 3, 'figure with three sub-figures should be displayed in manuscript view')
  t.notOk(_canMoveUp(), 'move up tool shoold not be available')
  t.notOk(_canMoveDown(), 'move down tool shoold not be available')

  // click on different sub-figures to test tools availability
  _selectSubFigure(0)
  t.equal(_getSelectedSubFigureId(), subFigure1Id, 'first sub-figure should be visually selected')
  t.notOk(_canMoveUp(), 'move up tool shoold not be available')
  t.ok(_canMoveDown(), 'move down sub-figure tool shoold be available for a first sub-figure')

  _selectSubFigure(1)
  t.equal(_getSelectedSubFigureId(), subFigure2Id, 'second sub-figure should be visually selected')
  t.ok(_canMoveUp(), 'move up tool shoold be available')
  t.ok(_canMoveDown(), 'move down tool shoold be available')

  _selectSubFigure(2)
  t.equal(_getSelectedSubFigureId(), subFigure3Id, 'third sub-figure should be visually selected')
  t.ok(_canMoveUp(), 'move up tool shoold be available')
  t.notOk(_canMoveDown(), 'move down tool shoold not be available')

  // move down twice and check tool availability, selections, ids and labels
  _selectSubFigure(2)
  doesNotThrowInNodejs(t, () => {
    _moveUp()
  }, 'move up should not throw')
  t.deepEqual(_getSubFigureIds(), [subFigure1Id, subFigure3Id, subFigure2Id], 'sub-figures id should match')
  t.deepEqual(_getSubFigureLabels(), labels, 'sub-figures labels should be updated')
  t.equal(_getSelectedSubFigureId(), subFigure3Id, 'selection should move, with sub-figure')

  doesNotThrowInNodejs(t, () => {
    _moveUp()
  }, 'move up should not throw')
  t.deepEqual(_getSubFigureIds(), [subFigure3Id, subFigure1Id, subFigure2Id], 'sub-figures id should match')
  t.deepEqual(_getSubFigureLabels(), labels, 'sub-figures labels should be updated')
  t.equal(_getSelectedSubFigureId(), subFigure3Id, 'selection should move, with sub-figure')

  _selectSubFigure(1)
  doesNotThrowInNodejs(t, () => {
    _moveDown()
  }, 'move down should not throw')
  t.deepEqual(_getSubFigureIds(), [subFigure3Id, subFigure2Id, subFigure1Id], 'sub-figures id should match')
  t.deepEqual(_getSubFigureLabels(), labels, 'sub-figures labels should be updated')
  t.equal(_getSelectedSubFigureId(), subFigure1Id, 'selection should move, with sub-figure')

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
  const xrefSelector = '.sc-xref.sm-fig'
  const emptyLabel = '???'
  const _createFigureRef = () => openMenuAndFindTool(editor, 'insert', insertFigureXrefSelector).click()
  const _getXref = () => editor.find(xrefSelector)
  const _selectXref = (xref) => xref.el.click()
  const _selectFirstTarget = () => {
    const firstXref = editor.find('.sc-edit-xref-tool .se-option .sc-preview')
    firstXref.click()
  }
  const _selectFirstSubFigure = () => {
    const firstThumbnail = editor.find('.sc-figure .se-thumbnails > .sc-figure-panel')
    firstThumbnail.click()
  }
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

  const xrefSelector = '.sc-inline-node .sm-fig'
  const getXref = () => editor.find(xrefSelector)
  const xrefListItem = '.sc-edit-xref-tool .se-option .sc-preview'
  const getXrefListItems = () => editor.findAll(xrefListItem)

  loadBodyFixture(editor, PARAGRAPH_WITH_MULTIPANELFIGURE)

  setCursor(editor, 'p1.content', 2)

  let insertFigureReferenceTool = openMenuAndFindTool(editor, 'insert', insertFigureXrefSelector)
  insertFigureReferenceTool.click()

  editor.find(xrefSelector).click()
  getXrefListItems()[0].click()
  getXrefListItems()[1].click()
  t.equal(getXref().text(), 'Figures 1A‒B', 'xref label should be Figure 1A-B')

  const firstThumbnail = editor.find('.sc-figure .se-thumbnails > .sc-figure-panel')
  firstThumbnail.click()
  const removePanelTool = openMenuAndFindTool(editor, 'figure-tools', removePanelToolSelector)
  t.ok(removePanelTool.click(), 'clicking on remove sub-figure tool should not throw error')
  t.equal(getXref().text(), 'Figure 1', 'xref label should be equal to xref label')
  t.end()
})

test('Figure: replace image in figure panel', t => {
  // TODO: we should test image upload better in the future with inspecting an asset
  // that requires some improvements on archive level
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIGURE_WITH_TWO_PANELS)

  let firstThumbnail = editor.find('.sc-figure .se-thumbnails > .sc-figure-panel')
  firstThumbnail.click()
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

function _selectFigurePanel (editor, panel) {
  let figureId = panel.getParent().id
  let panelId = panel.id
  // click on the preview
  editor.find(`.sc-figure[data-id=${figureId}] .sc-figure-panel[data-id=${panelId}]`).click()
}

function _removeFigurePanel (editor) {
  let tool = openMenuAndFindTool(editor, 'figure-tools', removePanelToolSelector)
  return tool.click()
}

function _isToolEnabled (editor, toolClass) {
  return isToolEnabled(editor, 'figure-tools', toolClass)
}
