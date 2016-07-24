'use strict';

var TextNode = require('substance/model/TextNode');

function Label() {
  Label.super.apply(this, arguments);
}

TextNode.extend(Label);

Label.type = 'label';

Label.define({
  attributes: { type: 'object', default: {} },
});

module.exports = Label;