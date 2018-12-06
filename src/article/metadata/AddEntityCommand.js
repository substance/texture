import { Command } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    const workflow = this.config.workflow
    if (workflow) {
      context.editor.send('startWorkflow', workflow)
    } else {
      const collection = this._getCollection(params, context)
      // adding an empty item
      collection.addItem({})
      context.editor.send('toggleOverlay')
    }
  }

  // Default implementation takes the collection via configuration.
  _getCollection (params, context) {
    const collectionName = this.config.collection
    return context.api.getModelById(collectionName)
  }
}
