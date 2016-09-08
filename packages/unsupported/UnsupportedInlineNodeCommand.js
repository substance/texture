import { InlineNodeCommand } from 'substance'

function UnsupportedInlineNodeCommand() {
  UnsupportedInlineNodeCommand.super.apply(this, arguments);
}

InlineNodeCommand.extend(UnsupportedInlineNodeCommand);

UnsupportedInlineNodeCommand.type = 'unsupported-inline';

export default UnsupportedInlineNodeCommand;
