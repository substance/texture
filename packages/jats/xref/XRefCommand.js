'use strict';

var InlineNodeCommand = require('substance/ui/InlineNodeCommand');

function XRefCommand() {
  XRefCommand.super.apply(this, arguments);
}

InlineNodeCommand.extend(XRefCommand);

module.exports = XRefCommand;