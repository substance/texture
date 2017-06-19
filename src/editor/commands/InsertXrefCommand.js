import { InsertInlineNodeCommand, uuid } from 'substance'

export default class InsertXrefCommand extends InsertInlineNodeCommand {
  createNodeData() {
    let refType = this.config.refType
    return {
      id: uuid('xref'),
      type: 'xref',
      attributes: {
        'ref-type': refType,
        'rid': ''
      }
    }
  }
}
