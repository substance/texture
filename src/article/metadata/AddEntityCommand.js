import { Command } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }
  execute (params, context) {
    // EXPERIMENTAL: trying to send an action
    // TODO: maybe a different approach?
    context.editor.send('startWorkflow', this.config.workflow)
  }
}
