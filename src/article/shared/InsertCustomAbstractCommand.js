import { documentHelpers } from 'substance'
import AddEntityCommand from './AddEntityCommand'
import CustomAbstract from '../models/CustomAbstract'

export default class InsertCustomAbstractCommand extends AddEntityCommand {
  _createNode (tx) {
    return documentHelpers.createNodeFromJson(tx, CustomAbstract.getTemplate())
  }
}
