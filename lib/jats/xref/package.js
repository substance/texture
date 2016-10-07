import XRef from './XRef'
import XRefComponent from './XRefComponent'
import XRefConverter from './XRefConverter'
import EditXRefCommand from './EditXRefCommand'
import EditXRefTool from './EditXRefTool'
import AddXRefCommand from './AddXRefCommand'
import AddXRefTool from './AddXRefTool'

export default {
  name: 'xref',
  configure: function(config) {
    config.addNode(XRef)
    config.addComponent(XRef.type, XRefComponent)
    config.addConverter('jats', XRefConverter)

    config.addCommand('edit-xref', EditXRefCommand, {nodeType: XRef.type})
    config.addCommand('add-xref', AddXRefCommand, {nodeType: XRef.type})

    config.addTool('add-xref', AddXRefTool, {target: 'insert'})
    config.addTool('edit-xref', EditXRefTool, { target: 'overlay' })

    config.addLabel('add-xref', 'Cross Reference')
    config.addIcon('add-xref', { 'fontawesome': 'fa-external-link' })
    config.addLabel(XRef.type, {
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
