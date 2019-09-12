import {
  UndoCommand, RedoCommand, SelectAllCommand
} from 'substance'

export default {
  name: 'EditorBase',
  configure: function (config) {
    config.addCommand('undo', UndoCommand, { commandGroup: 'undo-redo' })
    config.addCommand('redo', RedoCommand, { commandGroup: 'undo-redo' })
    config.addCommand('select-all', SelectAllCommand, { commandGroup: 'selection' })

    config.addIcon('insert', { 'fontawesome': 'fa-plus' })
    config.addIcon('undo', { 'fontawesome': 'fa-undo' })
    config.addIcon('redo', { 'fontawesome': 'fa-redo fa-repeat' })
    config.addIcon('edit', { 'fontawesome': 'fa-cog' })
    config.addIcon('delete', { 'fontawesome': 'fa-times' })
    config.addIcon('expand', { 'fontawesome': 'fa-arrows-h' })
    config.addIcon('truncate', { 'fontawesome': 'fa-arrows-h' })
    config.addIcon('close', { 'fontawesome': 'fa-times fa-close' })

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
    config.addLabel('close', {
      en: 'Close',
      de: 'Schließen'
    })

    config.addKeyboardShortcut('CommandOrControl+Z', { command: 'undo' })
    config.addKeyboardShortcut('CommandOrControl+Shift+Z', { command: 'redo' })
    config.addKeyboardShortcut('CommandOrControl+A', { command: 'select-all' })
  }
}
