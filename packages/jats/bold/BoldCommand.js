'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function BoldCommand() {
  BoldCommand.super.apply(this, arguments);
}

AnnotationCommand.extend(BoldCommand);

BoldCommand.static.name = 'bold';

module.exports = BoldCommand;