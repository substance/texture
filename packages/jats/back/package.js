import Back from './Back'
import BackConverter from './BackConverter'
import BackComponent from './BackComponent'

export default {
  name: 'back',
  configure: function(config) {
    config.addNode(Back)
    config.addConverter('jats', BackConverter)
    config.addComponent(Back.type, BackComponent)
  }
}