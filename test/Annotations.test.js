import { test } from 'substance-test'
import { setCursor, setSelection, openManuscriptEditor, loadBodyFixture, isToolEnabled, openMenu } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { doesNotThrowInNodejs } from './shared/testHelpers'

const ANNOS = [
  {
    name: 'Strong',
    menu: 'format',
    tool: 'toggle-bold',
    selector: '.sc-annotation.sm-bold'
  },
  {
    name: 'Emphasize',
    menu: 'format',
    tool: 'toggle-italic',
    selector: '.sc-annotation.sm-italic'
  },
  {
    name: 'Link',
    menu: 'insert',
    tool: 'create-external-link',
    selector: '.sc-external-link'
  },
  {
    name: 'Small Caps',
    menu: 'format',
    tool: 'toggle-small-caps',
    selector: '.sc-annotation.sm-small-caps'
  },
  {
    name: 'Subscript',
    menu: 'format',
    tool: 'toggle-subscript',
    selector: '.sc-annotation.sm-subscript'
  },
  {
    name: 'Superscript',
    menu: 'format',
    tool: 'toggle-superscript',
    selector: '.sc-annotation.sm-superscript'
  },
  {
    name: 'Monospace',
    menu: 'format',
    tool: 'toggle-monospace',
    selector: '.sc-annotation.sm-monospace'
  },
  {
    name: 'Overline',
    menu: 'format',
    tool: 'toggle-overline',
    selector: '.sc-annotation.sm-overline'
  },
  {
    name: 'Strike Through',
    menu: 'format',
    tool: 'toggle-strike-through',
    selector: '.sc-annotation.sm-strike-through'
  },
  {
    name: 'Underline',
    menu: 'format',
    tool: 'toggle-underline',
    selector: '.sc-annotation.sm-underline'
  }
]

// const ANNO_SELECTOR = {
//   'external-link': '.sc-external-link'
// }

const FIXTURE = `<p id="p1">Lorem ipsum dolor sit amet.</p>`

ANNOS.forEach(spec => {
  test(`Annotations: toggle ${spec.name} annotation`, t => {
    testAnnotationToggle(t, spec)
  })
})

function testAnnotationToggle (t, spec) {
  let { editor } = _setup(t)
  const _hasAnno = () => {
    return Boolean(editor.find(`[data-path="p1.content"] ${spec.selector}`))
  }
  // Set the cursor and check if tool is active
  setCursor(editor, 'p1.content', 3)
  t.notOk(_isToolEnabled(editor, spec), 'tool should be disabled')
  // Set the selection and check if tool is active
  setSelection(editor, 'p1.content', 2, 4)
  t.ok(_isToolEnabled(editor, spec), 'tool should be enabled')
  // Toggle the annotation
  _toggleAnnotation(t, editor, spec)
  t.ok(_hasAnno(), 'there should be an annotation')
  // then toggle the annotation again to remove it
  t.ok(_isToolEnabled(editor, spec), 'tool should be enabled')
  _toggleAnnotation(t, editor, spec)
  t.notOk(_hasAnno(), 'There should be no annotation')
  t.end()
}

function _setup (t) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIXTURE)
  return { editor }
}

function _isToolEnabled (editor, spec) {
  return isToolEnabled(editor, spec.menu, `.sc-tool.sm-${spec.tool}`)
}

function _toggleAnnotation (t, editor, spec) {
  doesNotThrowInNodejs(t, () => {
    let menu = openMenu(editor, spec.menu)
    menu.find(`.sc-tool.sm-${spec.tool}`).el.click()
  })
}
