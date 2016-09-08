import XRef from './XRef'
import XRefComponent from './XRefComponent'
import XRefConverter from './XRefConverter'
import XRefCommand from './XRefCommand'
import XRefTool from './XRefTool'
import AddXRefCommand from './AddXRefCommand'
import AddXRefTool from './AddXRefTool'

export default {
  name: 'xref',
  configure: function(config) {
    config.addNode(XRef);
    config.addComponent(XRef.type, XRefComponent);
    config.addConverter('jats', XRefConverter);

    // TODO: is there a way to use only one command for the two different tools
    config.addCommand(XRef.type, XRefCommand, {nodeType: XRef.type});
    config.addCommand('add-xref', AddXRefCommand, {nodeType: XRef.type});
    config.addTool('add-xref', AddXRefTool);
    config.addTool(XRef.type, XRefTool, { overlay: true });

    config.addIcon('add-xref', { 'fontawesome': 'fa-external-link' });
    config.addLabel(XRef.type, {
      en: 'Cross Reference'
    });
    config.addLabel('edit-xref', {
      en: 'Edit Reference'
    });
    config.addLabel('delete-xref', {
      en: 'Delete Reference'
    });
  }
};
