import { AddEntityCommand } from '../commands'

export class AddAuthorCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addAuthor()
  }
}

export class AddCustomAbstractCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addCustomAbstract()
  }
}
