import InsertCrossReferenceCommand from './InsertCrossReferenceCommand'

export default class InsertFootnoteCrossReferenceCommand extends InsertCrossReferenceCommand {
  execute (params, context) {
    context.api.insertFootnoteReference()
  }
}
