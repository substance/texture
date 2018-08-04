import BooleanModelEditor from './BooleanModelEditor'
import StringModelEditor from './StringModelEditor'
import SingleRelationshipEditor from './SingleRelationshipEditor'
import ManyRelationshipEditor from './ManyRelationshipEditor'
import ChildrenModelEditor from './ChildrenModelEditor'

export default {
  name: 'ModelEditor',
  configure (configurator) {
    configurator.addComponent('boolean-model', BooleanModelEditor)
    configurator.addComponent('string-model', StringModelEditor)
    configurator.addComponent('single-relationship-model', SingleRelationshipEditor)
    configurator.addComponent('many-relationship-model', ManyRelationshipEditor)
    configurator.addComponent('children-model', ChildrenModelEditor)
  }
}
