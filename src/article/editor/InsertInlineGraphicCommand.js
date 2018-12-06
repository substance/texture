import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertInlineGraphicCommand extends InsertInlineNodeCommand {
  getType () {
    return 'inline-graphic'
  }

  // Overridden as we are using API code here
  _execute (params, context) {
    const files = params.files
    let api = context.api
    if (files.length > 0) {
      api._insertInlineGraphic(files[0])
    }
  }
}
