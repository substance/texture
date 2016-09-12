'use strict';

import Footnote from './Footnote'
import FootnoteComponent from './FootnoteComponent'
import FootnoteConverter from './FootnoteConverter'

export default {
  name: 'footnote',
  configure: function(config) {
    config.addNode(Footnote);
    config.addComponent(Footnote.type, FootnoteComponent);
    config.addConverter('jats', FootnoteConverter);
  }
};