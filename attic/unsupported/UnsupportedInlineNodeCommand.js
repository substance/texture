import { EditInlineNodeCommand } from 'substance'

class UnsupportedInlineNodeCommand extends EditInlineNodeCommand {}

UnsupportedInlineNodeCommand.type = 'unsupported-inline'

export default UnsupportedInlineNodeCommand
