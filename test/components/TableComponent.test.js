import { EditorSession, MemoryDOMElement } from 'substance'
import {
  TableComponent, TextureDocument, TextureConfigurator, tableHelpers,
  EditorPackage, TableEditing
} from 'substance-texture'
import { testAsync, getMountPoint } from '../testHelpers'

testAsync('TableComponent: mounting a table component', async (t) => {
  let { table, context } = _setup(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  t.notNil(el.find('.sc-table'), 'there should be a rendered table element')
  t.end()
})

testAsync('TableComponent: setting table selections', async (t) => {
  let { editorSession, table, context } = _setup(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let firstCell = matrix[0][0]
  let tableEditing = new TableEditing(editorSession, table.id, comp.getSurfaceId())
  // setting the selection on the first cell
  let sel = tableEditing.createTableSelection({
    anchorCellId: firstCell.id,
    focusCellId: firstCell.id
  })
  editorSession.setSelection(sel)
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'visible', 'the selection overlay for the selection anchor should be visible')
  t.equal(comp.refs.selRange.el.css('visibility'), 'visible', 'the selection overlay for the selection range should be visible')

  // setting the selection inside the first cell
  editorSession.setSelection({
    type: 'property',
    path: firstCell.getPath(),
    startOffset: 0,
    endOffset: 0
  })
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'visible', 'the selection overlay for the selection anchor should be visible')
  t.equal(comp.refs.selRange.el.css('visibility'), 'hidden', 'the selection overlay for the selection range should be hidden')

  // nulling the selection
  editorSession.setSelection(null)
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'hidden', 'the selection overlay for the selection anchor should be hidden')
  t.equal(comp.refs.selRange.el.css('visibility'), 'hidden', 'the selection overlay for the selection range should be hidden')

  t.end()
})

function _setup (t) {
  let configurator = new TextureConfigurator()
  configurator.import(EditorPackage)
  let doc = _createEmptyTextureArticle(configurator)
  let table = tableHelpers.generateTable(doc, 10, 5)
  doc.find('body > body-content').append(table)
  // TODO: look closely here: this is the footprint of how context
  // is used by TableComponent and children
  let editorSession = new EditorSession(doc, { configurator })
  let componentRegistry = configurator.getComponentRegistry()
  let commandGroups = configurator.getCommandGroups()
  let iconProvider = configurator.getIconProvider()
  let labelProvider = configurator.getLabelProvider()
  let keyboardShortcuts = configurator.getKeyboardShortcuts()
  let tools = configurator.getTools()
  let context = {
    editorSession,
    configurator,
    componentRegistry,
    commandGroups,
    tools,
    iconProvider,
    labelProvider,
    keyboardShortcuts
  }
  return { context, editorSession, doc, table }
}

function _createEmptyTextureArticle (configurator) {
  let doc = new TextureDocument(configurator.getSchema())
  doc.$$ = doc.createElement.bind(doc)
  const $$ = doc.$$
  $$('article', { id: 'article' }).append(
    $$('front').append(
      $$('article-meta').append(
        $$('title-group').append(
          $$('article-title')
        ),
        $$('abstract')
      )
    ),
    $$('body').append(
      $$('body-content')
    ),
    $$('back')
  )
  return doc
}

// FIXME: add compatibility stub implementations
MemoryDOMElement.prototype.getBoundingClientRect = function () {
  return { top: 0, left: 0, height: 0, width: 0 }
}

MemoryDOMElement.prototype.getClientRects = function () {
  return [{ top: 0, left: 0, height: 0, width: 0 }]
}
