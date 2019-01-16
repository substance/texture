import { domHelpers } from 'substance'
import { ToggleTool } from '../../kit'

/*
  Tool to edit math markup.
*/
export default class EditDispFormulaTool extends ToggleTool {
  render ($$) {
    let Input = this.getComponent('input')
    let commandState = this.props.commandState
    let el = $$('div').addClass('sc-edit-math-tool')

    // GUARD: Return if tool is disabled
    if (commandState.disabled) {
      console.warn('Tried to render EditMathTool while disabled.')
      return el
    }
    let nodeId = this.getNodeId()
    el.append(
      $$(Input, {
        type: 'text',
        path: [nodeId, 'content'],
        placeholder: 'Enter TeX'
      }).addClass('sm-big-input')
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
}
