import { Command, documentHelpers } from 'substance'

// TODO: consolidate AddEntityCommand and RemoveItemCommand etc.

class BasicCollectionCommand extends Command {
  constructor (...args) {
    super(...args)

    // EXPERIMENTAL: 'pre-compiling' a selector for the current xpath
    // later this selector will be compiled by the CommandManager, and commands be inhibited if the selector does not match current xpath
    // for now we only support '<type>.<property>' as selector format. Later this will be extended as we need it.
    let xpathSelector = this.config.xpathSelector
    if (xpathSelector) {
      // ATTENTION: this is not ready for any other format than '<type>.<property>'
      let [type, property] = xpathSelector.split('.')
      this._contextSelector = { type, property }
    }
  }

  getCommandState (params, context) {
    let { collectionPath, item, position } = this._detectCollection(params, context)
    return { disabled: (!collectionPath || !item), collectionPath, item, position }
  }

  _detectCollection (params, context) {
    let doc = context.editorSession.getDocument()
    let selectionState = params.selectionState
    let xpath = selectionState.xpath
    if (this._contextSelector && xpath.length > 0) {
      let idx = xpath.findIndex(x => x.type === this._contextSelector.type)
      let first = xpath[idx]
      let second = xpath[idx + 1]
      if (first && second && second.property === this._contextSelector.property) {
        let collectionPath = [first.id, second.property]
        let item = doc.get(second.id)
        let position = -1
        if (item) {
          position = item.getPosition()
        }
        return { collectionPath, item, position }
      }
    }
    return {}
  }
}

export class RemoveCollectionItemCommand extends BasicCollectionCommand {
  execute (params, context) {
    const { collectionPath, item } = params.commandState
    let editorSession = context.editorSession
    editorSession.transaction(tx => {
      documentHelpers.remove(tx, collectionPath, item.id)
      tx.selection = null
    })
  }
}

export class MoveCollectionItemCommand extends BasicCollectionCommand {
  getCommandState (params, context) {
    let commandState = super.getCommandState(params, context)
    if (!commandState.disabled) {
      // check the posision
      const direction = this.config.direction
      const { collectionPath, position } = commandState
      let ids = context.editorSession.getDocument().get(collectionPath)
      if (
        (direction === 'up' && position === 0) ||
        (direction === 'down' && position === ids.length - 1)
      ) {
        commandState.disabled = true
      }
    }
    return commandState
  }

  execute (params, context) {
    const direction = this.config.direction
    const { collectionPath, item, position } = params.commandState
    // TODO: should we really trust the commandState?
    let newPosition = direction === 'up' ? position - 1 : position + 1
    let editorSession = context.editorSession
    editorSession.transaction(tx => {
      documentHelpers.removeAt(tx, collectionPath, position)
      documentHelpers.insertAt(tx, collectionPath, newPosition, item.id)
      // TODO: what about the selection?
    })
  }
}
