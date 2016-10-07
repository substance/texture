import Title from './Title'
import TitleConverter from './TitleConverter'
import TitleComponent from './TitleComponent'

export default {
  name: 'title',
  configure: function(config) {
    config.addNode(Title)
    config.addConverter('jats', TitleConverter)
    config.addComponent(Title.type, TitleComponent)
  }
}
