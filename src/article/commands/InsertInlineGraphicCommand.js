import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertInlineGraphicCommand extends InsertInlineNodeCommand {
  getType () {
    return 'inline-graphic'
  }

  execute (params, context) {
    const files = params.files
    if (files.length > 0) {
      context.api.insertInlineGraphic(files[0])
    }
  }
}
