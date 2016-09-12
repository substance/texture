'use strict';

import { AnnotationCommand } from 'substance'

function BoldCommand() {
  BoldCommand.super.apply(this, arguments);
}

AnnotationCommand.extend(BoldCommand);

export default BoldCommand;