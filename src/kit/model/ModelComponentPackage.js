import BooleanComponent from './BooleanComponent'
import FlowContentComponent from './FlowContentComponent'
import StringModelComponent from './StringComponent'
import TextModelComponent from './TextComponent'
import ObjectComponent from './ObjectComponent'
import SingleRelationshipComponent from './SingleRelationshipComponent'
import ManyRelationshipComponent from './ManyRelationshipComponent'
import ChildrenComponent from './ChildrenComponent'
import CompositeComponent from './CompositeComponent'
import TextNodeComponent from './TextNodeComponent'

export default {
  name: 'Model Components',
  configure (configurator) {
    // TODO: maybe we want to use just '<type>' as name instead of '<type>-model'
    configurator.addComponent('boolean-model', BooleanComponent)
    configurator.addComponent('string-model', StringModelComponent)
    configurator.addComponent('text-model', TextModelComponent)
    configurator.addComponent('flow-content-model', FlowContentComponent)
    configurator.addComponent('object-model', ObjectComponent)
    configurator.addComponent('single-relationship-model', SingleRelationshipComponent)
    configurator.addComponent('many-relationship-model', ManyRelationshipComponent)
    configurator.addComponent('children-model', ChildrenComponent)
    configurator.addComponent('composite-model', CompositeComponent)
    // LEGACY
    configurator.addComponent('text-node', TextNodeComponent)
  }
}
