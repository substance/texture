import Superscript from './Superscript'
import SuperscriptConverter from './SuperscriptConverter'

export default {
  name: 'superscript',
  configure: function(config) {
    config.addNode(Superscript)
    config.addConverter('jats', SuperscriptConverter)
  }
}
