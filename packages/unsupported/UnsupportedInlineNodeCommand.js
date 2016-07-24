'use strict';

var InlineNodeCommand = require('substance/ui/InlineNodeCommand');

function UnsupportedInlineNodeCommand() {
  UnsupportedInlineNodeCommand.super.apply(this, arguments);
}

InlineNodeCommand.extend(UnsupportedInlineNodeCommand);

UnsupportedInlineNodeCommand.type = 'unsupported-inline';

module.exports = UnsupportedInlineNodeCommand;
