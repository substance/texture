import {
  UndoCommand, RedoCommand, SelectAllCommand
} from 'substance'

export default {
  name: 'editor-basics',
  configure: function (config) {
    config.addCommand('undo', UndoCommand, { commandGroup: 'undo-redo' })
    config.addCommand('redo', RedoCommand, { commandGroup: 'undo-redo' })
    config.addCommand('select-all', SelectAllCommand, { commandGroup: 'selection' })

    config.addLabel('undo', {
      en: 'Undo',
      de: 'Rückgängig'
    })
    config.addLabel('redo', {
      en: 'Redo',
      de: 'Wiederherstellen'
    })
    config.addLabel('select-all', {
      en: 'Select All',
      de: 'Alles Auswählen'
    })

    config.addKeyboardShortcut('CommandOrControl+Z', { command: 'undo' })
    config.addKeyboardShortcut('CommandOrControl+Shift+Z', { command: 'redo' })
    config.addKeyboardShortcut('CommandOrControl+A', { command: 'select-all' })
  }
}
