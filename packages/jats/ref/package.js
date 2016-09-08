import Ref from './Ref'
import RefComponent from './RefComponent'
import RefTarget from './RefTarget'
import RefConverter from './RefConverter'
import TagRefCommand from './TagRefCommand'
import TagRefTool from './TagRefTool'

export default {
  name: 'ref',
  configure: function(config) {
    config.addNode(Ref);
    config.addComponent(Ref.type, RefComponent);
    config.addComponent(Ref.type+'-target', RefTarget);
    config.addConverter('jats', RefConverter);
    config.addCommand('tag-ref', TagRefCommand);
    config.addTool('tag-ref', TagRefTool);
    config.addIcon('tag-ref', { 'fontawesome': 'fa-bullseye' });
  }
}
