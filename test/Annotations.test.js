import { test } from 'substance-test'
import { setCursor, setSelection, openManuscriptEditor, loadBodyFixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const annotations = [
  {
    name: 'Strong',
    type: 'bold',
    menu: 'format',
    tool: 'toggle-bold'
  },
  {
    name: 'Emphasize',
    type: 'italic',
    menu: 'format',
    tool: 'toggle-italic'
  },
  {
    name: 'Link',
    type: 'ext-link',
    menu: 'insert',
    tool: 'create-ext-link'
  },
  {
    name: 'Subscript',
    type: 'sub',
    menu: 'format',
    tool: 'toggle-subscript'
  },
  {
    name: 'Superscript',
    type: 'sup',
    menu: 'format',
    tool: 'toggle-superscript'
  },
  {
    name: 'Monospace',
    type: 'monospace',
    menu: 'format',
    tool: 'toggle-monospace'
  }
]

const ANNO_SELECTOR = {
  'external-link': '.sc-external-link'
}

const fixture = `<p id="p1">
Lorem <bold>ipsum</bold> dolor <italic>sit</italic> amet, ea <ext-link href="foo">ludus</ext-link>
intellegat his, <sub>graece</sub> fastidii <sup>phaedrum</sup> ea mea, ne duo esse <monospace>omnium</monospace>.
</p>`

annotations.forEach(anno => {
  test(`Annotations: toggle ${anno.name} annotation`, t => {
    testAnnotationToggle(t, anno)
  })
})

function testAnnotationToggle (t, anno) {
  let { editor } = _setup(t)
  toggleTool(t, editor, anno)

  // Set the cursor and check if tool is active
  setCursor(editor, 'p1.content', 3)
  t.equal(_isToolActive(editor, anno), false, 'Tool must be disabled')
  // Set the selection and check if tool is active
  setSelection(editor, 'p1.content', 2, 4)
  t.equal(_isToolActive(editor, anno), true, 'Tool must be active')
  // Toggle the tool and check if an annotation appeared
  toggleTool(t, editor, anno)
  let annoEl = editor.find('[data-path="p1.content"] .sc-' + anno.type)
  let annoId = annoEl.getAttribute('data-id')
  t.notNil(annoEl, 'There should be an annotation')
  let offset = annoEl.getAttribute('data-offset')
  t.equal(offset, '2', 'The data-offset property must be equal to begining of the selection')
  let length = annoEl.getAttribute('data-length')
  t.equal(length, '2', 'The data-length property must be equal to the length of the selection')
  let text = annoEl.text()
  t.equal(text.length, parseInt(length), 'The number of annotated symbols must be equal to length of the selection')
  // Set the cursor, toggle the tool and check if an annotation disappeared
  setCursor(editor, 'p1.content', 3)
  t.equal(_isToolActive(editor, anno), true, 'Tool must be active')
  toggleTool(t, editor, anno)
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

function _isToolActive (el, anno) {
  let menu = _openMenu(el, anno.menu)
  let toolEl = menu.find(`.sc-menu-item.sm-${anno.tool}`)
  return !toolEl.getAttribute('disabled')
}

function toggleTool (t, editor, anno) {
  t.doesNotThrow(() => {
    let menu = _openMenu(editor, anno.menu)
    menu.find(`.sc-menu-item.sm-${anno.tool}`).el.click()
  })
}

function _openMenu (el, menuName) {
  const menu = el.find(`.sc-tool-dropdown.sm-${menuName}`)
  const isActive = menu.find('button').hasClass('sm-active')
  if (!isActive) {
    menu.find('button').el.click()
  }
  return menu
}
