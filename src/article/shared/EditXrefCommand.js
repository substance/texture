import { EditInlineNodeCommand } from 'substance'

export default class EditXrefCommand extends EditInlineNodeCommand {
  getCommandState (...args) {
    let commandState = super.getCommandState(...args)
    return commandState
  }
}
