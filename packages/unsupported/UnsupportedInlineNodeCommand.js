'use strict';

var InlineNodeCommand = require('substance/ui/InlineNodeCommand');

function UnsupportedInlineNodeCommand() {
  UnsupportedInlineNodeCommand.super.apply(this, arguments);
}

InlineNodeCommand.extend(UnsupportedInlineNodeCommand);
UnsupportedInlineNodeCommand.static.name = 'unsupported-inline';
module.exports = UnsupportedInlineNodeCommand;
