import Monospace from './Monospace'
import MonospaceConverter from './MonospaceConverter'

export default {
  name: 'monospace',
  configure: function(config) {
    config.addNode(Monospace)
    config.addConverter('jats', MonospaceConverter)
  }
}
