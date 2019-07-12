import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertCrossReferenceCommand extends InsertInlineNodeCommand {
  getType () {
    return 'xref'
  }

  execute (params, context) {
    context.api.insertCrossReference(this.config.refType)
  }
}
