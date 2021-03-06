// import { test } from 'substance-test'
// import { createTestVfs, getSelection, loadBodyFixture, openManuscriptEditor, openMenuAndFindTool } from './shared/integrationTestHelpers'
// import setupTestApp from './shared/setupTestApp'
// import { DEFAULT_JATS_SCHEMA_ID, DEFAULT_JATS_DTD } from 'substance-texture'

// TODO: test BiblioGraphicEntryEditor
// TODO: test ReferenceUpload
// TODO: add general tests for kit value editors

// const TRANSLATED_TITLE = `<?xml version="1.0" encoding="UTF-8"?>
// <!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.2 20190208//EN" "JATS-journalarchiving.dtd">
// <article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
//   <front>
//     <article-meta>
//       <title-group>
//         <article-title>Object vision to hand action in macaque parietal, premotor, and motor cortices</article-title>
//         <trans-title-group xml:lang="es">
//           <trans-title id="trans-title-1">Objeto de visión a acción manual en <italic id="italic-1">cortezas parietales</italic>, premotoras y motoras de macaco</trans-title>
//         </trans-title-group>
//       </title-group>
//       <abstract>
//       </abstract>
//     </article-meta>
//   </front>
//   <body>
//   </body>
//   <back>
//   </back>
// </article>`

// const EMPTY_ARTICLE = `<?xml version="1.0" encoding="UTF-8"?>
// <!DOCTYPE article PUBLIC "${DEFAULT_JATS_SCHEMA_ID}" "${DEFAULT_JATS_DTD}">
// <article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
//   <front>
//     <article-meta>
//       <title-group>
//         <article-title></article-title>
//       </title-group>
//     </article-meta>
//   </front>
//   <body>
//   </body>
//   <back>
//   </back>
// </article>`

// test(`MetadataEditor: after adding a new footnote cursor should be inside (#948)`, t => {
//   let { editor } = _setup(t, EMPTY_ARTICLE)
//   _addItem(editor, 'footnote')
//   let sel = getSelection(editor)
//   let isContentPropertySelection = sel && sel.isPropertySelection() && sel.getPath()[1] === 'content'
//   t.ok(isContentPropertySelection, 'The footnote content should be selected')
//   t.end()
// })

// // const ONE_FIG = `
// // <fig id="fig1">
// //   <caption>
// //     <title>Test</title>
// //     <p id="f1-caption-p1">Lorem Ipsum</p>
// //   </caption>
// //   <graphic />
// // </fig>
// // `
// test(`MetadataEditor: figure caption should be editable`, t => {
//   let { app } = setupTestApp(t, { archiveId: 'blank' })
//   // FIXME: MetadataEditor is not reacting properly on content changes
//   // i.e. loadBodyFixture must be done before the metadata view is opened
//   let editor = openManuscriptEditor(app)
//   loadBodyFixture(editor, ONE_FIG)
//   editor = openMetadataEditor(app)
//   let figurePanel = editor.find('.sc-card.sm-figure-panel[data-id="fig1"]')
//   let legendEditor = figurePanel.find('.sc-form-row.sm-legend > .se-editor > .sc-container-editor')
//   t.notNil(legendEditor, 'figure panel should have a container editor for the legend')
//   t.end()
// })

// function _setup (t, seedXML) {
//   let testVfs = createTestVfs(seedXML)
//   let { app } = setupTestApp(t, {
//     vfs: testVfs,
//     archiveId: 'test'
//   })
//   let editor = openMetadataEditor(app)
//   return { editor }
// }

// function _addItem (metadataEditor, modelName) {
//   // open the add drop down
//   let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
//   addDropDown.find('button').click()
//   addDropDown.find('.sc-tool.sm-insert-' + modelName).click()
// }
