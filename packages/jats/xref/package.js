import XRef from './XRef'
import XRefComponent from './XRefComponent'
import XRefConverter from './XRefConverter'
import XRefCommand from './XRefCommand'
import XRefTool from './XRefTool'

export default {
  name: 'xref',
  configure: function(config) {
    config.addNode(XRef)
    config.addComponent(XRef.type, XRefComponent)
    config.addConverter('jats', XRefConverter)
    config.addCommand(XRef.type, XRefCommand)
    config.addTool(XRef.type, XRefTool, { overlay: true })
    config.addStyle(__dirname, '_xref.scss')
    config.addLabel('xref', {
      en: 'Cross Reference'
    })
    config.addLabel('edit-xref', {
      en: 'Edit Reference'
    })
    config.addLabel('delete-xref', {
      en: 'Delete Reference'
    })
  }
}
