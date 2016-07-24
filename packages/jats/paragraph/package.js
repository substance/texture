'use strict';

var Paragraph = require('./Paragraph');
var ParagraphComponent = require('./ParagraphComponent');
var ParagraphConverter = require('./ParagraphConverter');

module.exports = {

  name: 'paragraph',

  configure: function(config) {
    config.addNode(Paragraph);
    config.addComponent(Paragraph.type, ParagraphComponent);
    config.addConverter('jats', ParagraphConverter);
    config.addTextType({
      name: Paragraph.type,
      data: {type: Paragraph.type}
    });
    config.addLabel(Paragraph.type, {
      en: 'Paragraph',
      de: 'Paragraph'
    });
    config.addLabel('paragraph.content', {
      en: 'Paragraph',
      de: 'Paragraph'
    });
  }
};
