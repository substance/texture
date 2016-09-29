import ExtLink from './ExtLink'
import ExtLinkConverter from './ExtLinkConverter'
import ExtLinkComponent from './ExtLinkComponent'
import ExtLinkTool from './ExtLinkTool'
import ExtLinkCommand from './ExtLinkCommand'
import EditExtLinkCommand from './EditExtLinkCommand'
import EditExtLinkTool from './EditExtLinkTool'

export default {
  name: 'ext-link',
  configure: function(config) {
    config.addNode(ExtLink)
    config.addConverter('jats', ExtLinkConverter)
    config.addComponent(ExtLink.type, ExtLinkComponent)

    config.addCommand(ExtLink.type, ExtLinkCommand, {nodeType: ExtLink.type})
    config.addCommand('edit-ext-link', EditExtLinkCommand, {nodeType: ExtLink.type})
    config.addTool(ExtLink.type, ExtLinkTool, {target: 'annotations'})
    config.addTool('edit-ext-link', EditExtLinkTool, { target: 'overlay' })
    config.addIcon(ExtLink.type, { 'fontawesome': 'fa-link'})
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' })
    config.addLabel(ExtLink.type, {
      en: 'Link'
    })
    config.addLabel('open-link', {
      en: 'Open Link',
      de: 'Link öffnen'
    })
    config.addLabel('delete-link', {
      en: 'Remove Link',
      de: 'Link löschen'
    })
  }
}
