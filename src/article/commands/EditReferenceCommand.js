import { Reference } from '../nodes'
import EditEntityCommand from './EditEntityCommand'

export default class EditReferenceCommand extends EditEntityCommand {
  _getType () {
    return Reference.type
  }
}
