import InsertNodeCommand from './InsertNodeCommand'
import { Figure } from '../nodes'

// TODO: this is kind of surprising, because it actually allows to insert multiple figures at once
export default class InsertFigureCommand extends InsertNodeCommand {
  getType () {
    return Figure.type
  }
  execute (params, context) {
    const state = params.commandState
    const files = params.files
    if (state.disabled) return
    if (files.length > 0) {
      context.api.insertImagesAsFigures(files)
    }
  }
}
