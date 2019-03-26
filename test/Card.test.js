import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, findParent, getEditorSession, getSelection } from './shared/integrationTestHelpers'
import { injectStyle, getMountPoint } from './shared/testHelpers'

test('Card: select the underlying model when clicking on a card', t => {
  // TODO: use a smaller fixture, then we know the exact model id, too
  showOnlyRelevant(t)
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = openMetadataEditor(app)
  let card = metadataEditor.find('.sc-card')
  let nodeId = card.props.node.id
  card.el.click()
  let sel = getSelection(metadataEditor)
  let actual = {
    type: sel.type,
    customType: sel.customType,
    nodeId: sel.nodeId
  }
  let expected = {
    type: 'custom',
    customType: 'card',
    nodeId
  }
  t.deepEqual(actual, expected, 'card should be selected')
  t.ok(card.el.is('.sm-selected'), 'the card component should have been updated')
  t.end()
})

// Note: this issue was observed when setting the cursor into a footnote
// and after that clicking on the card
test('Card: selecting a card after editing a footnote (regression #841)', t => {
  // TODO: try to use a smaller fixture
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = openMetadataEditor(app)
  let fnSurface = metadataEditor.find('.sc-surface[data-id="fn1.content"]')
  let textProperty = fnSurface.find('.sc-text-property')
  let editorSession = getEditorSession(metadataEditor)
  editorSession.setSelection({
    type: 'property',
    path: textProperty.getPath(),
    startOffset: 0,
    surfaceId: fnSurface.getSurfaceId()
  })
  let card = findParent(fnSurface, '.sc-card')
  let nodeId = card.props.node.id
  card.el.click()
  let sel = getSelection(metadataEditor)
  t.deepEqual({
    type: sel.type,
    customType: sel.customType,
    nodeId: sel.nodeId
  }, {
    type: 'custom',
    customType: 'card',
    nodeId
  }, 'card should be selected')
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
