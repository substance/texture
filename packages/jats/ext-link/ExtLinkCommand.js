'use strict';

var LinkCommand = require('substance/packages/link/LinkCommand');

function ExtLinkCommand() {
  ExtLinkCommand.super.apply(this, arguments);
}

ExtLinkCommand.Prototype = function() {
  this.getAnnotationData = function() {
    return {
      attributes: {
        'xlink:href': ''
      }
    };
  };
};

LinkCommand.extend(ExtLinkCommand);

module.exports = ExtLinkCommand;