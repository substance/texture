import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, findParent, getEditorSession } from './shared/integrationTestHelpers'
import { injectStyle, getMountPoint } from './shared/testHelpers'

test('Card: select the underlying model when clicking on a card', t => {
  // TODO: try to use a smaller fixture
  showOnlyRelevant(t)
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = openMetadataEditor(app)
  let card = metadataEditor.find('.sc-card')
  let modelId = card.props.modelId
  card.el.click()
  let sel = metadataEditor.context.appState.selection
  t.deepEqual({ type: sel.type, customType: sel.customType, data: sel.data }, { type: 'custom', customType: 'model', data: { modelId } }, 'model should be selected')
  t.ok(card.el.is('.sm-selected'), 'the card component should have been updated')
  t.end()
})

// Note: this issue was observed when setting the cursor into a footnote
// and after that clicking on the card
test('Issue #841: regression with model selections', t => {
  // TODO: try to use a smaller fixture
  showOnlyRelevant(t)
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = openMetadataEditor(app)
  let fnSurface = metadataEditor.find('.sc-surface[data-id="fn1"]')
  let textProperty = fnSurface.find('.sc-text-property')
  let editorSession = getEditorSession(metadataEditor)
  editorSession.setSelection({
    type: 'property',
    path: textProperty.getPath(),
    startOffset: 0,
    surfaceId: fnSurface.getSurfaceId()
  })
  let card = findParent(fnSurface, '.sc-card')
  let modelId = card.props.modelId
  card.el.click()
  let sel = metadataEditor.context.appState.selection
  t.deepEqual({ type: sel.type, customType: sel.customType, data: sel.data }, { type: 'custom', customType: 'model', data: { modelId } }, 'model should be selected')
  t.ok(card.el.is('.sm-selected'), 'the card component should have been updated')
  t.end()
})

// hide everything but the author section
let STYLE = `
.sc-card-test .sc-metadata-editor .se-main-section > * { display: none; }
.sc-card-test .sc-metadata-editor .se-main-section > .se-content-section { display: block; }
.sc-card-test .sc-metadata-editor .se-main-section > .se-content-section .se-sections > * { display: none; }
.sc-card-test .sc-metadata-editor .se-main-section > .se-content-section .se-sections > #authors { display: block; }
/* .sc-manyrelationship-test { background: blue; } */
`
function showOnlyRelevant (t) {
  let el = getMountPoint(t)
  el.addClass('sc-card-test')
  injectStyle(t, STYLE)
}
