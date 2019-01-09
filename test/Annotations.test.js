import { test } from 'substance-test'
import { setCursor, setSelection, openManuscriptEditor, loadBodyFixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { doesNotThrowInNodejs } from './shared/testHelpers';

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
  t.equal(_isToolActive(editor, spec), false, 'Tool must be disabled')
  // Set the selection and check if tool is active
  setSelection(editor, 'p1.content', 2, 4)
  t.equal(_isToolActive(editor, spec), true, 'Tool must be active')
  // Toggle the annotation
  _toggleAnnotation(t, editor, spec)
  t.ok(_hasAnno(), 'There should be an annotation')
  // then toggle the annotation again to remove it
  t.equal(_isToolActive(editor, spec), true, 'Tool must be active')
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

function _isToolActive (editor, spec) {
  let menu = _openMenu(editor, spec.menu)
  let toolEl = menu.find(`.sc-menu-item.sm-${spec.tool}`)
  let isActive = toolEl && !toolEl.getAttribute('disabled')
  return isActive
}

function _toggleAnnotation (t, editor, spec) {
  doesNotThrowInNodejs(t, () => {
    let menu = _openMenu(editor, spec.menu)
    menu.find(`.sc-menu-item.sm-${spec.tool}`).el.click()
  })
}

function _openMenu (editor, menuName) {
  let menu = editor.find(`.sc-tool-dropdown.sm-${menuName}`)
  let toggle = menu.refs.toggle
  if (!toggle.hasClass('sm-active')) {
    toggle.el.click()
  }
  return menu
}
