import Ref from './Ref'
import RefComponent from './RefComponent'
import RefTarget from './RefTarget'
import RefConverter from './RefConverter'

export default {
  name: 'ref',
  configure: function(config) {
    config.addNode(Ref)
    config.addComponent(Ref.type, RefComponent)
    config.addComponent(Ref.type+'-target', RefTarget)
    config.addConverter('jats', RefConverter)
  }
}
