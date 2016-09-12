import Aff from './Aff'
import AffComponent from './AffComponent'
import AffConverter from './AffConverter'

export default {
  name: 'aff',
  configure: function(config) {
    config.addNode(Aff)
    config.addComponent(Aff.type, AffComponent);
    config.addConverter('jats', AffConverter);
  }
}
