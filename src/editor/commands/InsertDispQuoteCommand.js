import { InsertNodeCommand } from 'substance'

export default class InsertXrefCommand extends InsertNodeCommand {
  createNodeData() {
    throw new Error('TODO: Needs different approach with XML data model')
  }
}
