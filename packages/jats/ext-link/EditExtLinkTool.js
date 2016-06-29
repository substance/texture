'use strict';

var EditLinkTool = require('substance/packages/link/EditLinkTool');
var clone = require('lodash/clone');

function EditExtLinkTool() {
  EditExtLinkTool.super.apply(this, arguments);
}

EditExtLinkTool.Prototype = function() {
};

EditLinkTool.extend(EditExtLinkTool);

EditExtLinkTool.static.urlPropertyPath = ['attributes', 'xlink:href'];
EditExtLinkTool.static.name = 'edit-ext-link';

EditExtLinkTool.static.getProps = function(commandStates) {
  if (commandStates['ext-link'].mode === 'edit') {
    return clone(commandStates['ext-link']);
  } else {
    return undefined;
  }
};

module.exports = EditExtLinkTool;