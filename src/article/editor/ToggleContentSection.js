import { Command } from 'substance'

class ToggleContentSection extends Command {

  getCommandState(params) {
    let editor = params.editorSession.getEditor()

    let commandState = {
      disabled: true,
    }

    if (editor) {
      let comp = this._getSectionComponent(params)
      let hidden = comp.state.hidden
      commandState.disabled = false
      commandState.showOrHide = hidden ? 'Show' : 'Hide'
    }

    return commandState
  }

  /*
    Returns all cell components found in the document
  */
  _getSectionComponent(params) {
    let editor = params.editorSession.getEditor()
    return editor.find(this.config.selector)
  }

  execute(params) {
    let comp = this._getSectionComponent(params)
    comp.extendState({
      hidden: !comp.state.hidden
    })
    params.editorSession.setSelection(null)
  }

}

export default ToggleContentSection
