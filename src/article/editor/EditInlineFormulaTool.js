import { domHelpers } from 'substance'
import { ToggleTool } from '../../shared'

/*
  Tool to edit math markup.
*/
export default class EditInlineFormulaTool extends ToggleTool {
  render ($$) {
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

  getNodeId () {
    return this.props.commandState.nodeId
  }

  getSourcePath () {
    const commandState = this.props.commandState
    const doc = this.context.editorSession.getDocument()
    const nodeId = commandState.nodeId
    const inlineFormula = doc.get(nodeId)
    const texMath = inlineFormula.find('tex-math')
    return texMath.getPath()
  }

  onDelete (e) {
    console.error('FIXME: use ArticleAPI to delete formula')
    // e.preventDefault();
    // let nodeId = this.getNodeId()
    // let sm = this.context.surfaceManager
    // let surface = sm.getFocusedSurface()
    // if (!surface) {
    //   console.warn('No focused surface. Stopping command execution.')
    //   return
    // }
    // let editorSession = this.context.editorSession
    // editorSession.transaction((tx, args) => {
    //   tx.delete(nodeId)
    //   return args
    // })
  }
}
