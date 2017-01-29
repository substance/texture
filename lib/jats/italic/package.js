import Italic from './Italic'
import ItalicConverter from './ItalicConverter'
import ItalicTool from './ItalicTool'
import ItalicCommand from './ItalicCommand'

export default {
  name: 'italic',
  configure: function(config) {
    config.addNode(Italic)
    config.addConverter('jats', ItalicConverter)

    config.addCommand(Italic.type, ItalicCommand, { nodeType: Italic.type })
    config.addTool(Italic.type, ItalicTool, {toolGroup: 'annotations'})
    config.addIcon(Italic.type, { 'fontawesome': 'fa-italic' })
    config.addLabel(Italic.type, {
      en: 'Italic'
    })
  }
}
