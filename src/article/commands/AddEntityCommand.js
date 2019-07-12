import { Command } from 'substance'

/**
 * A base implementation for commands that add an entity, e.g. a Reference, to
 * a collection.
 */
export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }

  execute (params, context) {
    throw new Error('This is abstract')
  }
}
