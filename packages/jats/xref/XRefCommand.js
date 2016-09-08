'use strict';

import { InlineNodeCommand } from 'substance'

function XRefCommand() {
  XRefCommand.super.apply(this, arguments);
}

InlineNodeCommand.extend(XRefCommand);

export default XRefCommand;