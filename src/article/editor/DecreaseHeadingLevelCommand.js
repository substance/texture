import { Command } from 'substance'

class DecreaseHeadingLevelCommand extends Command {
  getCommandState (params) {
    let doc = params.editorSession.getDocument()
    let sel = params.selection
    let isBlurred = params.editorSession.isBlurred()

    let commandState = {
      disabled: false
    }

    if (sel.isPropertySelection() && !isBlurred) {
      let path = sel.getPath()
      let node = doc.get(path[0])
      if (node &&
        node.isBlock() &&
        node.type === 'heading') {
        commandState.active = true
      } else {
        commandState.disabled = true
      }
    } else {
      commandState.disabled = true
    }

    return commandState
  }

  execute (params) {
    let sel = params.selection
    let editorSession = params.editorSession
    let doc = editorSession.getDocument()
    let path = sel.getPath()
    let node = doc.get(path[0])
    if (node.getAttribute('level') > 1) {
      editorSession.transaction((txDoc) => {
        let node = txDoc.get(path[0])
        node.setAttribute('level', String(parseInt(node.level, 10) - 1))
      })
    }
  }
}

export default DecreaseHeadingLevelCommand
