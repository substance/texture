import BooleanModelEditor from './BooleanModelEditor'
import StringModelEditor from './StringModelEditor'
import SingleRelationshipEditor from './SingleRelationshipEditor'
import ManyRelationshipEditor from './ManyRelationshipEditor'

export default {
  name: 'ModelEditor',
  configure (configurator) {
    configurator.addComponent('boolean', BooleanModelEditor)
    configurator.addComponent('string', StringModelEditor)
    configurator.addComponent('single-relationship', SingleRelationshipEditor)
    configurator.addComponent('many-relationship', ManyRelationshipEditor)
  }
}
