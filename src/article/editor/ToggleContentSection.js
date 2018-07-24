import { Command } from 'substance'

// FIXME: this should use editor state to manage 'visibility'
export default class ToggleContentSection extends Command {
  getCommandState (params) { // eslint-disable-line no-unused-vars
    return Command.DISABLED
  }

  _getSectionComponent (params) { // eslint-disable-line no-unused-vars
    // let editor = params.editorSession.getEditor()
    // return editor.find(this.config.selector)
  }

  execute (params) { // eslint-disable-line no-unused-vars
    // let comp = this._getSectionComponent(params)
    // comp.extendState({
    //   hidden: !comp.state.hidden
    // })
    // params.editorSession.setSelection(null)
  }
}
