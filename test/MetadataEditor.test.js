import { test } from 'substance-test'
import { openMetadataEditor, createTestVfs, getSelection } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const TRANSLATED_TITLE = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title>Object vision to hand action in macaque parietal, premotor, and motor cortices</article-title>
        <trans-title-group xml:lang="es">
          <trans-title id="trans-title-1">Objeto de visión a acción manual en <italic id="italic-1">cortezas parietales</italic>, premotoras y motoras de macaco</trans-title>
        </trans-title-group>
      </title-group>
      <abstract>
      </abstract>
    </article-meta>
  </front>
  <body>
  </body>
  <back>
  </back>
</article>`

const EMPTY_ARTICLE = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
    </article-meta>
  </front>
  <body>
  </body>
  <back>
  </back>
</article>`

test(`MetadataEditor: clicking on "Add Translation" should not select card (#838)`, t => {
  let { editor } = _setup(t, TRANSLATED_TITLE)
  let translatableEditor = editor.find('.sc-translatable-editor')
  // TODO: I don't like 'se-control' as a name for the 'Add Translation' button
  let addTranslation = translatableEditor.find('.se-control')
  addTranslation.click()
  let sel = getSelection(editor)
  let isCardSelected = sel && sel.isCustomSelection() && sel.getCustomType() === 'model'
  t.notOk(isCardSelected, 'The translation card should not be selected')
  t.end()
})

test(`MetadataEditor: a newly created footnote should contain at least one parapgraph (#947)`, t => {
  let { editor } = _setup(t, EMPTY_ARTICLE)
  _addItem(editor, 'footnote')
  let fnEditor = editor.find('.sc-footnote .sc-fn')
  let paragraphs = fnEditor.findAll('.sc-p')
  t.ok(paragraphs.length > 0, 'There should be some paragraphs')
  t.end()
})

test(`MetadataEditor: after adding a new footnote cursor should be inside (#948)`, t => {
  let { editor } = _setup(t, EMPTY_ARTICLE)
  _addItem(editor, 'footnote')
  let sel = getSelection(editor)
  let isContentPropertySelection = sel && sel.isPropertySelection() && sel.getPath()[1] === 'content'
  t.ok(isContentPropertySelection, 'The footnote content should be selected')
  t.end()
})

function _setup (t, seedXML) {
  let testVfs = createTestVfs(seedXML)
  let {app} = setupTestApp(t, {
    vfs: testVfs,
    archiveId: 'test'
  })
  let editor = openMetadataEditor(app)
  return { editor }
}

function _addItem (metadataEditor, modelName) {
  // open the add drop down
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-add')
  addDropDown.find('button').click()
  addDropDown.find('.sc-menu-item.sm-add-' + modelName).click()
}
