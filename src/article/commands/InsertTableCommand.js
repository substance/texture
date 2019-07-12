import InsertNodeCommand from './InsertNodeCommand'

export default class InsertTableCommand extends InsertNodeCommand {
  execute (params, context) {
    context.api.insertTable()
  }
}
