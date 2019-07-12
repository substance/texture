import { InsertNodeCommand as SubstanceInsertNodeCommand } from 'substance'

export default class InsertNodeCommand extends SubstanceInsertNodeCommand {
  execute (params, context) {
    throw new Error('This method is abstract')
  }
}
