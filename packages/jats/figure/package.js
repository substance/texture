import Figure from './Figure'
import FigureComponent from './FigureComponent'
import FigureTarget from './FigureTarget'
import FigureConverter from './FigureConverter'

export default {
  name: 'figure',
  configure: function(config) {
    config.addNode(Figure)
    config.addComponent(Figure.type, FigureComponent)
    config.addComponent(Figure.type+'-target', FigureTarget)
    config.addConverter('jats', FigureConverter)
  }
}
