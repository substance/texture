import { Command } from 'substance'
import Heading from '../models/Heading'

export default class IncreaseHeadingLevelCommand extends Command {
  getCommandState (params, context) {
    let selState = context.appState.selectionState
    if (selState && selState.node && selState.node.type === 'heading') {
      return { disabled: selState.node.level >= Heading.MAX_LEVEL }
    } else {
      return { disabled: true }
    }
  }

  execute (params) {
    let editorSession = params.editorSession
    editorSession.transaction(tx => {
      tx.indent()
    })
  }
}
