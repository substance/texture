import { Command } from 'substance'

// TODO: pull out commands into individual files
// and move manipulation code into ArticleAPI

// turns the current text node into a list
export class CreateListCommand extends Command {
  isSwitchTypeCommand () { return true }

  // TODO: do we want to generalize this to other list types?
  getType () {
    return 'list'
  }

  getCommandState (params) {
    let editorSession = params.editorSession
    let doc = editorSession.getDocument()
    let sel = editorSession.getSelection()
    if (sel && sel.isPropertySelection()) {
      let path = sel.path
      let node = doc.get(path[0])
      if (node) {
        if (node.isText()) {
          return {
            disabled: false
          }
        }
      }
    }
    return { disabled: true }
  }

  execute (params) {
    let commandState = params.commandState
    const { disabled } = commandState
    if (disabled) return
    let editorSession = params.editorSession
    editorSession.transaction(tx => {
      tx.toggleList({ listType: this.config.spec.listType })
    }, { action: 'toggleList' })
  }
}

export class ChangeListTypeCommand extends Command {
  getCommandState (params) {
    let editorSession = params.editorSession
    let doc = editorSession.getDocument()
    let sel = editorSession.getSelection()
    if (sel && sel.isPropertySelection()) {
      let path = sel.path
      let node = doc.get(path[0])
      if (node) {
        if (node.isListItem()) {
          let level = node.getLevel()
          let list = node.getParent()
          let listType = list.getListType(level)
          let active = listType === this.config.spec.listType
          let action = active ? 'toggleList' : 'setListType'
          let listId = list.id
          return {
            disabled: false,
            active,
            action,
            listId,
            level
          }
        }
      }
    }
    return { disabled: true }
  }

  execute (params) {
    let commandState = params.commandState
    const { disabled, action } = commandState
    if (disabled) return

    let editorSession = params.editorSession
    switch (action) {
      case 'toggleList': {
        editorSession.transaction((tx) => {
          tx.toggleList()
        }, { action: 'toggleList' })
        break
      }
      case 'setListType': {
        const { listId, level } = commandState
        editorSession.transaction((tx) => {
          let list = tx.get(listId)
          list.setListType(level, this.config.spec.listType)
        }, { action: 'setListType' })
        break
      }
      default:
      //
    }
  }
}
