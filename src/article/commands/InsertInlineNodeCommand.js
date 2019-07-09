import { InsertInlineNodeCommand as SubstanceInsertInlineNodeCommand } from 'substance'

export default class InsertInlineNodeCommand extends SubstanceInsertInlineNodeCommand {
  getType () {
    throw new Error('This method is abstract')
  }

  /**
    Insert new inline node at the current selection
  */
  execute (params, context) {
    throw new Error('This method is abstract')
  }

  isDisabled (params, context) {
    return !context.api.canInsertInlineNode(this.getType(), true)
  }
}
