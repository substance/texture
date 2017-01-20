import { LinkCommand, EditAnnotationCommand } from 'substance'
import ExtLink from './ExtLink'
import ExtLinkConverter from './ExtLinkConverter'
import ExtLinkComponent from './ExtLinkComponent'
import ExtLinkTool from './ExtLinkTool'
import EditExtLinkTool from './EditExtLinkTool'

export default {
  name: 'ext-link',
  configure: function(config) {
    config.addNode(ExtLink)
    config.addConverter('jats', ExtLinkConverter)
    config.addComponent(ExtLink.type, ExtLinkComponent)

    config.addCommand(ExtLink.type, LinkCommand, {nodeType: ExtLink.type})
    config.addCommand('edit-ext-link', EditAnnotationCommand, {nodeType: ExtLink.type})
    config.addTool(ExtLink.type, ExtLinkTool, {toolGroup: 'annotations'})
    config.addTool('edit-ext-link', EditExtLinkTool, { toolGroup: 'overlay' })
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
