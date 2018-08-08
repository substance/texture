import { TextPropertyEditor } from '../../kit'

export default class TableCellEditor extends TextPropertyEditor {

  _handleEscapeKey(event) {
    this.__handleKey(event, 'escape')
  }

  _handleEnterKey(event) {
    this.__handleKey(event, 'enter')
  }

  _handleTabKey(event) {
    this.__handleKey(event, 'tab')
  }

  __handleKey(event, name) {
    event.stopPropagation()
    event.preventDefault()
    this.el.emit(name, {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      code: event.code
    })
  }

}