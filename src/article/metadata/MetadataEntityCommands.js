import { AddEntityCommand } from '../commands'

// Note: we need two different commands cause of the context
export class AddAuthorCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addAuthor()
  }
}
