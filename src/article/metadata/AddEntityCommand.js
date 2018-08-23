import { Command } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }
  execute (params, context) {
    const collectionName = this.config.collection
    const collection = context.api.getModelById(collectionName)
    // adding an empty item
    collection.addItem({})
  }
}
