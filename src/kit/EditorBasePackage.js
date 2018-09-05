import {
  UndoCommand, RedoCommand, InputPackage
} from 'substance'

import SelectAllCommand from './app/SelectAllCommand'

export default {
  name: 'EditorBase',
  configure: function (config) {
    // TODO: do we still need this?
    config.import(InputPackage)

    config.addCommand('undo', UndoCommand, { commandGroup: 'undo-redo' })
    config.addCommand('redo', RedoCommand, { commandGroup: 'undo-redo' })
    config.addCommand('select-all', SelectAllCommand, { commandGroup: 'selection' })

    config.addIcon('insert', { 'fontawesome': 'fa-plus' })
    config.addIcon('undo', { 'fontawesome': 'fa-undo' })
    config.addIcon('redo', { 'fontawesome': 'fa-repeat' })
    config.addIcon('edit', { 'fontawesome': 'fa-cog' })
    config.addIcon('delete', { 'fontawesome': 'fa-times' })
    config.addIcon('expand', { 'fontawesome': 'fa-arrows-h' })
    config.addIcon('truncate', { 'fontawesome': 'fa-arrows-h' })

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
