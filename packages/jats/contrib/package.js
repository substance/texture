import Contrib from './Contrib'
import ContribComponent from './ContribComponent'
import ContribConverter from './ContribConverter'
import TagContribCommand from './TagContribCommand'
import TagContribTool from './TagContribTool'

export default {
  name: 'contrib',
  configure: function(config) {
    config.addNode(Contrib);
    config.addComponent(Contrib.type, ContribComponent);
    config.addConverter('jats', ContribConverter);
    config.addCommand('tag-contrib', TagContribCommand);
    config.addTool('tag-contrib', TagContribTool);
    config.addIcon('tag-contrib', { 'fontawesome': 'fa-bullseye' });
  }
}
