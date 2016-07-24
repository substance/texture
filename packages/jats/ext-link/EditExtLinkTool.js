'use strict';

var EditLinkTool = require('substance/packages/link/EditLinkTool');
var clone = require('lodash/clone');

function EditExtLinkTool() {
  EditExtLinkTool.super.apply(this, arguments);
}

EditLinkTool.extend(EditExtLinkTool);

EditExtLinkTool.urlPropertyPath = ['attributes', 'xlink:href'];

EditExtLinkTool.getProps = function(commandStates) {
  if (commandStates['ext-link'].mode === 'edit') {
    return clone(commandStates['ext-link']);
  } else {
    return undefined;
  }
};

module.exports = EditExtLinkTool;
