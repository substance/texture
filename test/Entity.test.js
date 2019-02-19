import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, selectCard, clickUndo, getSelection, getSelectionState, openContextMenuAndFindTool, createTestVfs } from './shared/integrationTestHelpers'
import { doesNotThrowInNodejs } from './shared/testHelpers'

function _entityTest (t, entityType, entityName, checkSelection) {
  entityName = entityName || entityType

  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)

  const CARD_SELECTOR = `.sc-card.sm-${entityType}`
  const _hasCard = () => { return Boolean(editor.find(CARD_SELECTOR)) }
  const _getModelId = () => { return editor.find(CARD_SELECTOR).getAttribute('data-id') }
  function _defaultCheckSelection (t, sel) {
    t.deepEqual({
      type: sel.type,
      nodeId: sel.getNodeId()
    }, {
      type: 'property',
      nodeId: _getModelId()
    }, 'a field in the new entity should be selected')
  }

  doesNotThrowInNodejs(t, () => {
    _insertEntity(editor, entityName)
  })
  t.ok(_hasCard(), 'there should be a card for the new entity')
  // Note: checking the selection as good as we can. The selected field us derived from the node schema and settings
  // TODO: we could apply a specific configuration so that we know the field name
  let sel = getSelection(editor)
  let selState = getSelectionState(editor)
  let _checkSelection = checkSelection || _defaultCheckSelection
  _checkSelection(t, sel, selState)

  // in addition to the plain 'Add Entity' we also test removal + undo
  selectCard(editor, _getModelId())
  _removeEntity(editor, entityName)
  t.notOk(_hasCard(), 'card should have been removed')

  clickUndo(editor)
  t.ok(_hasCard(), 'card should be back again')

  t.end()
}

test(`Entity: add author`, t => {
  _entityTest(t, 'person', 'author')
})

test(`Entity: add editor`, t => {
  _entityTest(t, 'person', 'editor')
})

test(`Entity: add group`, t => {
  _entityTest(t, 'group')
})

test(`Entity: add affiliation`, t => {
  _entityTest(t, 'organisation')
})

test(`Entity: add funder`, t => {
  _entityTest(t, 'funder')
})

test(`Entity: add keyword`, t => {
  _entityTest(t, 'keyword')
})

test(`Entity: add subject`, t => {
  _entityTest(t, 'subject')
})

test(`Entity: add footnote`, t => {
  _entityTest(t, 'footnote', 'footnote', (t, sel, selState) => {
    t.equal(sel.type, 'property', 'selection should be an property selection')
    t.ok(Boolean(selState.xpath.find(e => e.type === 'paragraph')), '.. inside a paragraph')
  })
})

const AUTHOR_AND_TWO_AFFS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
      <contrib-group content-type="author">
        <contrib contrib-type="person" equal-contrib="yes" corresp="yes" deceased="no">
          <name>
            <surname>Doe</surname>
            <given-names>John</given-names>
          </name>
          <email>john.doe@university</email>
          <xref ref-type="aff" rid="aff1" />
          <xref ref-type="aff" rid="aff2" />
        </contrib>
      </contrib-group>
      <aff id="aff1">
        <institution content-type="orgname">Org</institution>
        <institution content-type="orgdiv1">X</institution>
        <city>Linz</city>
        <country>Austria</country>
      </aff>
      <aff id="aff2">
        <institution content-type="orgname">Org</institution>
        <institution content-type="orgdiv1">Y</institution>
        <city>Linz</city>
        <country>Austria</country>
      </aff>
    </article-meta>
  </front>
  <body>
  </body>
  <back>
  </back>
</article>
`

test('Entity: Affilitions should be distinguishable (#981)', t => {
  let { app } = setupTestApp(t, {
    vfs: createTestVfs(AUTHOR_AND_TWO_AFFS),
    archiveId: 'test'
  })
  let metadataEditor = openMetadataEditor(app)
  let selectInput = metadataEditor.find('.sm-person .sm-affiliations .sc-many-relationship .sc-multi-select-input')
  // click on the input to open the dropdown
  selectInput.click()
  let items = selectInput.findAll('.se-select-item')
  let org1 = items[0].text()
  let org2 = items[1].text()
  t.ok(org1 !== org2, 'organisations should be displayed in a distinguishable way')
  t.end()
})

function _insertEntity (editor, entityName) {
  // open the corresponding dropdown
  let menu = editor.find('.sc-tool-dropdown.sm-insert')
  menu.find('button').el.click()
  let addButton = menu.find(`.sc-menu-item.sm-insert-${entityName}`).el
  return addButton.click()
}

function _removeEntity (editor, entityName) {
  let collectionTool = openContextMenuAndFindTool(editor, `.sm-remove-${entityName}`)
  collectionTool.click()
}
