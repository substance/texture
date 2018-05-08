import { Tool, domHelpers } from 'substance'

/*
  Tool to edit math markup.
*/
export default class EditInlineFormulaTool extends Tool {

  getNodeId() {
    return this.props.commandState.nodeId
  }

  getSourcePath() {
    const nodeId = this.props.commandState.nodeId
    const inlineFormula = this.context.editorSession.getDocument().get(nodeId)
    const texMath = inlineFormula._childNodes[0]
    return [ texMath ].concat('textContent')
  }

  render($$) {
    let Input = this.getComponent('input')
    let commandState = this.props.commandState
    let el = $$('div').addClass('sc-edit-math-tool')

    // GUARD: Return if tool is disabled
    if (commandState.disabled) {
      console.warn('Tried to render EditMathTool while disabled.')
      return el
    }

    let sourcePath = this.getSourcePath()

    el.append(
      $$(Input, {
        type: 'text',
        path: sourcePath,
        placeholder: 'Enter TeX'
      })
      // ATTNETION have a ref on it, otherwise the input will get rerendered on every change
      .ref('input')
      // stopping keydown events so that the input field is not distracted by other editor keyboard handler
      // TODO: maybe let 'Save' through...
      .on('keydown', domHelpers.stop)
    )
    return el
  }

  onDelete(e) {
    e.preventDefault();
    let nodeId = this.getNodeId()
    let sm = this.context.surfaceManager
    let surface = sm.getFocusedSurface()
    if (!surface) {
      console.warn('No focused surface. Stopping command execution.')
      return
    }
    let editorSession = this.context.editorSession
    editorSession.transaction((tx, args) => {
      tx.delete(nodeId)
      return args
    })
  }
}
