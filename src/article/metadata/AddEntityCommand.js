import { Command } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }
  execute (params, context) {
    const collectionName = this.config.collection
    if(collectionName) {
      const collection = context.api.getModel(collectionName)
      collection.addItem()
    } else {
      // EXPERIMENTAL: trying to send an action
      // TODO: maybe a different approach?
      context.editor.send('startWorkflow', this.config.workflow)
    }
  }
}
