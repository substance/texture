import BooleanModelEditor from './BooleanModelEditor'
import FlowContentModelEditor from './FlowContentModelEditor'
import StringModelEditor from './StringModelEditor'
import TextModelEditor from './TextModelEditor'
import ObjectModelEditor from './ObjectModelEditor'
import SingleRelationshipEditor from './SingleRelationshipEditor'
import ManyRelationshipEditor from './ManyRelationshipEditor'
import ChildrenModelEditor from './ChildrenModelEditor'

export default {
  name: 'Model Editors',
  configure (configurator) {
    configurator.addComponent('boolean-model', BooleanModelEditor)
    configurator.addComponent('string-model', StringModelEditor)
    configurator.addComponent('text-model', TextModelEditor)
    configurator.addComponent('flow-content-model', FlowContentModelEditor)
    configurator.addComponent('object-model', ObjectModelEditor)
    configurator.addComponent('single-relationship-model', SingleRelationshipEditor)
    configurator.addComponent('many-relationship-model', ManyRelationshipEditor)
    configurator.addComponent('children-model', ChildrenModelEditor)
  }
}
