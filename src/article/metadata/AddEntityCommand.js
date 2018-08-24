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
      const collectionName = this.config.collection
      const collection = context.api.getModelById(collectionName)
      // adding an empty item
      collection.addItem({})

      context.editor.send('toggleOverlay')
    }
  }
}
