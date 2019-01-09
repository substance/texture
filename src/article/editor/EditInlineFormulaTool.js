import { domHelpers } from 'substance'
import { ToggleTool } from '../../kit'

/**
 * Tool to edit the markup of an InlineFormula.
 */
export default class EditInlineFormulaTool extends ToggleTool {
  render ($$) {
    const { disabled, nodeId } = this.props.commandState
    const Input = this.getComponent('input')
    let el = $$('div').addClass('sc-edit-math-tool')

    // GUARD: Return if tool is disabled
    if (disabled) {
      console.warn('Tried to render EditMathTool while disabled.')
      return el
    }
    el.append(
      $$(Input, {
        type: 'text',
        path: [nodeId, 'content'],
        // TODO: use this.getLabel()
        placeholder: 'Enter TeX'
      })
        // ATTNETION have a ref on it, otherwise the input will get rerendered on every change
        .ref('input')
        // stopping keydown events so that the input field is not distracted by other editor keyboard handler
        // TODO: maybe let write through?
        .on('keydown', domHelpers.stop)
    )
    return el
  }
}
