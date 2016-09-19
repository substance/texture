import { InlineNodeCommand } from 'substance'

class AddXRefCommand extends InlineNodeCommand {
  createNodeData() {
    return {
      attributes: {'ref-type': 'bibr'},
      targets: [],
      label: '???',
      type: 'xref'
    }
  }
}

export default AddXRefCommand
