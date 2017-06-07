import { InsertInlineNodeCommand } from 'substance'

class AddXRefCommand extends InsertInlineNodeCommand {
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
