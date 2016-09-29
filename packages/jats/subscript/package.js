import Subscript from './Subscript'
import SubscriptConverter from './SubscriptConverter'

export default {
  name: 'subscript',
  configure: function(config) {
    config.addNode(Subscript)
    config.addConverter('jats', SubscriptConverter)
  }
}
