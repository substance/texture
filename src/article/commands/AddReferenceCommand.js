import AddEntityCommand from './AddEntityCommand'

export default class AddReferenceCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addReference()
  }
}
