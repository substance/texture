import BooleanComponent from './BooleanComponent'
import CollectionComponent from './CollectionComponent'
import StringModelComponent from './StringComponent'
import TextModelComponent from './TextComponent'
import ObjectComponent from './ObjectComponent'
import SingleRelationshipComponent from './SingleRelationshipComponent'
import ManyRelationshipComponent from './ManyRelationshipComponent'
import ChildComponent from './ChildComponent'
import TextNodeComponent from './TextNodeComponent'

export default {
  name: 'Model Components',
  configure (configurator) {
    // TODO: maybe we want to use just '<type>' as name instead of '<type>-model'
    configurator.addComponent('boolean', BooleanComponent)
    configurator.addComponent('child', ChildComponent)
    // TODO: do we need this anymore?
    configurator.addComponent('collection', CollectionComponent)
    configurator.addComponent('many-relationship', ManyRelationshipComponent)
    configurator.addComponent('object', ObjectComponent)
    configurator.addComponent('single-relationship', SingleRelationshipComponent)
    configurator.addComponent('string', StringModelComponent)
    configurator.addComponent('text', TextModelComponent)
    // LEGACY
    // TODO: do we need this anymore?
    configurator.addComponent('text-node', TextNodeComponent)
  }
}
