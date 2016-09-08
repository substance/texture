'use strict';

import Italic from './Italic'
import ItalicConverter from './ItalicConverter'

export default {
  name: 'italic',
  configure: function(config) {
    config.addNode(Italic);
    config.addConverter('jats', ItalicConverter);
  }
};
