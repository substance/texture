'use strict';

var InlineNodeCommand = require('substance/ui/InlineNodeCommand');

function XRefCommand() {
  XRefCommand.super.apply(this, arguments);
}

XRefCommand.Prototype = function() {

};

InlineNodeCommand.extend(XRefCommand);

XRefCommand.static.name = 'xref';

module.exports = XRefCommand;