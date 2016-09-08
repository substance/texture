'use strict';

import ExtLink from './ExtLink'
import ExtLinkConverter from './ExtLinkConverter'
import ExtLinkComponent from './ExtLinkComponent'
import ExtLinkTool from './ExtLinkTool'
import ExtLinkCommand from './ExtLinkCommand'
import EditExtLinkTool from './EditExtLinkTool'

export default {
  name: 'ext-link',
  configure: function(config) {
    config.addNode(ExtLink);
    config.addConverter('jats', ExtLinkConverter);
    config.addComponent(ExtLink.type, ExtLinkComponent);

    config.addCommand(ExtLink.type, ExtLinkCommand, {nodeType: ExtLink.type});
    config.addTool(ExtLink.type, ExtLinkTool);
    config.addTool('edit-ext-link', EditExtLinkTool, { overlay: true });
    config.addIcon(ExtLink.type, { 'fontawesome': 'fa-link'});
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' });
    config.addLabel(ExtLink.type, {
      en: 'Link'
    });
  }
}
