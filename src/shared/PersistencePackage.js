import SaveCommand from './SaveCommand'

export default {
  name: 'Persistence',
  configure (config) {
    config.addCommand('save', SaveCommand, {
      commandGroup: 'persistence'
    })
    config.addIcon('save', { 'fontawesome': 'fa-save' })
    config.addLabel('save', 'Save Document')
    // TODO: enable this once we have global key handling in place
    // config.addKeyboardShortcut('CommandOrControl+S', { command: 'save' })
  }
}
