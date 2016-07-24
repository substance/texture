'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function BoldCommand() {
  BoldCommand.super.apply(this, arguments);
}

AnnotationCommand.extend(BoldCommand);

module.exports = BoldCommand;