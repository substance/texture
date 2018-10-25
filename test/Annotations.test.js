import { test } from 'substance-test'
import { setCursor, setSelection, openManuscriptEditor, loadBodyFixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const annotationTypes = {
  'bold': 'Strong',
  'italic': 'Emphasize',
  'ext-link': 'Link',
  'sub': 'Subscript',
  'sup': 'Superscript',
  'monospace': 'Monospace'
}

const fixture = `<p id="p1">
Lorem <bold>ipsum</bold> dolor <italic>sit</italic> amet, ea <ext-link href="foo">ludus</ext-link>
intellegat his, <sub>graece</sub> fastidii <sup>phaedrum</sup> ea mea, ne duo esse <monospace>omnium</monospace>.
</p>`

Object.keys(annotationTypes).forEach(annoType => {
  test(`Annotations: toggle ${annotationTypes[annoType]} annotation`, t => {
    testAnnotationToggle(t, annoType)
  })
})

function testAnnotationToggle (t, annoType) {
  let { editor } = _setup(t)
  let annoToogle = editor.find('.sc-toggle-tool.sm-' + annoType)

  // Set the cursor and check if tool is active
  setCursor(editor, 'p1.content', 3)
  t.equal(isToolActive(editor, annoType), false, 'Tool must be disabled')
  // Set the selection and check if tool is active
  setSelection(editor, 'p1.content', 2, 4)
  t.equal(isToolActive(editor, annoType), true, 'Tool must be active')
  // Toggle the tool and check if an annotation appeared
  annoToogle.find('button').click()
  let anno = editor.find('[data-path="p1.content"] .sc-' + annoType)
  let annoId = anno.getAttribute('data-id')
  t.notNil(anno, 'There should be an annotation')
  let offset = anno.el.getAttribute('data-offset')
  t.equal(offset, '2', 'The data-offset property must be equal to begining of the selection')
  let length = anno.el.getAttribute('data-length')
  t.equal(length, '2', 'The data-length property must be equal to the length of the selection')
  let text = anno.text()
  t.equal(text.length, parseInt(length), 'The number of annotated symbols must be equal to length of the selection')
  // Set the cursor, toggle the tool and check if an annotation disappeared
  setCursor(editor, 'p1.content', 3)
  t.equal(isToolActive(editor, annoType), true, 'Tool must be active')
  annoToogle.find('button').click()
  let removedAnno = editor.find('[data-path="p1.content"] [data-id="' + annoId + '"]')
  t.isNil(removedAnno, 'There should be no annotation')
  t.end()
}

function _setup (t) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, fixture)
  return { editor }
}

function isToolActive (el, annoType) {
  let tool = el.find('.sc-toggle-tool.sm-' + annoType)
  let btn = tool.find('button')
  return !btn.getAttribute('disabled')
}
