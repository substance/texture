import TitleGroup from './TitleGroup'
import TitleGroupConverter from './TitleGroupConverter'
import TitleGroupComponent from './TitleGroupComponent'

export default {
  name: 'title-group',
  configure: function(config) {
    config.addNode(TitleGroup)
    config.addConverter('jats', TitleGroupConverter)
    config.addComponent(TitleGroup.type, TitleGroupComponent)
  }
}