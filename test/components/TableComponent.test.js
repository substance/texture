import { EditorSession } from 'substance'
import {
  TableComponent, TextureDocument, TextureConfigurator, tableHelpers,
  EditorPackage
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
  let context = { editorSession, configurator, componentRegistry, commandGroups }
  return { context, doc, table }
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
