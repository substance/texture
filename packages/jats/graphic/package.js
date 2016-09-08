'use strict';

import Graphic from './Graphic'
import GraphicComponent from './GraphicComponent'
import GraphicConverter from './GraphicConverter'

export default {
  name: 'graphic',
  configure: function(config) {
    config.addNode(Graphic);
    config.addComponent(Graphic.type, GraphicComponent);
    config.addConverter('jats', GraphicConverter);
  }
};