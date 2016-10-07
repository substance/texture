import Front from './Front'
import FrontConverter from './FrontConverter'
import FrontComponent from './FrontComponent'

export default {
  name: 'front',
  configure: function(config) {
    config.addNode(Front)
    config.addConverter('jats', FrontConverter)
    config.addComponent(Front.type, FrontComponent)
  }
}