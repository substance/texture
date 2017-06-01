import Caption from './Caption'
import CaptionComponent from './CaptionComponent'
import CaptionConverter from './CaptionConverter'

export default {
  name: 'caption',
  configure: function(config) {
    config.addNode(Caption)
    config.addComponent(Caption.type, CaptionComponent)
    config.addConverter('jats', CaptionConverter)
  }
}
