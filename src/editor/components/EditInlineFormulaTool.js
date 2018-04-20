import { Tool } from 'substance'

/*
  Tool to edit math markup.
*/
class EditInlineFormulaTool extends Tool {

  getSourcePath() {
    const nodeId = this.props.commandState.nodeId
    const inlineFormula = this.context.editorSession.getDocument().get(nodeId)
    const texMath = inlineFormula._childNodes[0]
    return [ texMath ].concat('textContent')
  }

  render($$) {
    let Input = this.getComponent('input')
    let el = $$('div').addClass('sc-edit-math-tool')

    // GUARD: Return if tool is disabled
    if (this.props.disabled) {
      console.warn('Tried to render EditLinkTool while disabled.')
      return el
    }

    let sourcePath = this.getSourcePath()
    el.append(
      'Math ',
      $$(Input, {
        type: 'text',
        path: sourcePath,
        placeholder: 'Enter TeX'
      })
    )
    return el
  }
}

export default EditInlineFormulaTool
