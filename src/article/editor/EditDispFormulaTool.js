import { parseKeyCombo, parseKeyEvent } from 'substance'
import { ToggleTool } from '../../kit'

const COMMAND_OR_CONTROL_ENTER = parseKeyCombo('CommandOrControl+Enter')

/*
  Tool to edit math markup.
*/
export default class EditDispFormulaTool extends ToggleTool {
  render ($$) {
    let TextArea = this.getComponent('text-area')
    let commandState = this.props.commandState
    let el = $$('div').addClass('sc-edit-math-tool')

    // GUARD: Return if tool is disabled
    if (commandState.disabled) {
      console.warn('Tried to render EditMathTool while disabled.')
      return el
    }
    let nodeId = this.getNodeId()
    el.append(
      $$(TextArea, {
        path: [nodeId, 'content'],
        placeholder: 'Enter TeX',
        rows: 10,
        cols: 80,
        retainFocus: true
      }).addClass('sm-big-input')
        // ATTNETION have a ref on it, otherwise the input will get rerendered on every change
        .ref('input')
        // stopping keydown events so that the input field is not distracted by other editor keyboard handler
        // TODO: maybe let 'Save' through...
        .on('keydown', this._onInputKeydown)
    )
    return el
  }

  getNodeId () {
    return this.props.commandState.nodeId
  }

  _onInputKeydown (event) {
    // in any case we do not want to let any keydowns bubble up when the cursor is inside the input
    // TODO: is that so?
    event.stopPropagation()
    let combo = parseKeyEvent(event)
    switch (combo) {
      case COMMAND_OR_CONTROL_ENTER: {
        this.refs.input._onChange()
        break
      }
      default:
        // nothing
    }
  }
}
