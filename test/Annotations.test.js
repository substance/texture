import { test } from 'substance-test'
import { setCursor, setSelection } from './integrationTestHelpers'
import setupTestApp from './setupTestApp'

const annotationTypes = {
  'bold': 'Strong',
  'italic': 'Emphasize',
  'ext-link': 'Link',
  'sub': 'Subscript',
  'sup': 'Superscript',
  'monospace': 'Monospace'
}

Object.keys(annotationTypes).forEach(annoType => {
  test(annotationTypes[annoType] + ': toggle annotation', t => {
    testAnnotationToggle(t, annoType)
  })
})

function testAnnotationToggle (t, annoType) {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  let annoToogle = articlePanel.find('.sc-toggle-tool.sm-' + annoType)
  let editor = articlePanel.find('.sc-manuscript-editor')

  // Set the cursor and check if tool is active
  setCursor(editor, 'p-2.content', 3)
  t.equal(isToolActive(articlePanel, annoType), false, 'Tool must be disabled')
  // Set the selection and check if tool is active
  setSelection(editor, 'p-2.content', 2, 4)
  t.equal(isToolActive(articlePanel, annoType), true, 'Tool must be active')
  // Toggle the tool and check if an annotation appeared
  annoToogle.find('button').click()
  let anno = editor.find('[data-path="p-2.content"] .sc-' + annoType)
  t.notNil(anno, 'There should be an annotation')
  let offset = anno.el.getAttribute('data-offset')
  t.equal(offset, '2', 'The data-offset property must be equal to begining of the selection')
  let length = anno.el.getAttribute('data-length')
  t.equal(length, '2', 'The data-length property must be equal to the length of the selection')
  let text = anno.text()
  t.equal(text.length, parseInt(length), 'The number of annotated symbols must be equal to length of the selection')
  // Set the cursor, toggle the tool and check if an annotation disappeared
  setCursor(editor, 'p-2.content', 3)
  t.equal(isToolActive(articlePanel, annoType), true, 'Tool must be active')
  annoToogle.find('button').click()
  let rempvedAnno = editor.find('[data-path="p-2.content"] .sc-bold')
  t.isNil(rempvedAnno, 'There should be no annotation')
  t.end()
}

function isToolActive (el, annoType) {
  let tool = el.find('.sc-toggle-tool.sm-' + annoType)
  let btn = tool.find('button')
  return !btn.getAttribute('disabled')
}
