import { platform } from 'substance'
import AnnotationComponent from '../ui/AnnotationComponent'
import FindAndReplaceCommand from './FindAndReplaceCommand'
import FindAndReplaceDialog from './FindAndReplaceDialog'

export default {
  name: 'find-and-replace',
  configure: function (config, userConfig) {
    config.addComponent('find-and-replace-dialog', FindAndReplaceDialog)
    config.addComponent('find-marker', AnnotationComponent)

    config.addCommand('open-find', FindAndReplaceCommand, {
      commandGroup: 'find-and-replace',
      action: 'open-find'
    })
    config.addCommand('open-replace', FindAndReplaceCommand, {
      commandGroup: 'find-and-replace',
      action: 'open-replace'
    })
    config.addKeyboardShortcut('CommandOrControl+F', { command: 'open-find' })
    // there are different conventions for opening replace
    if (platform.isMac) {
      config.addKeyboardShortcut('CommandOrControl+Alt+F', { command: 'open-replace' })
    } else {
      config.addKeyboardShortcut('CommandOrControl+H', { command: 'open-replace' })
    }
    config.addLabel('find-and-replace-title', {
      en: 'Find and replace'
    })
  }
}
