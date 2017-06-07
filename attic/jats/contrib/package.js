import Contrib from './Contrib'
import ContribComponent from './ContribComponent'
import ContribConverter from './ContribConverter'

export default {
  name: 'contrib',
  configure: function(config) {
    config.addNode(Contrib)
    config.addComponent(Contrib.type, ContribComponent)
    config.addConverter('jats', ContribConverter)
  }
}
