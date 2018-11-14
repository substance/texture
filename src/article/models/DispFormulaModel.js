import { getLabel } from '../shared/nodeHelpers'
import NodeModel from '../../kit/model/NodeModel'

export default class DispFormulaModel extends NodeModel {
  get type () { return 'disp-formula' }

  get id () { return this._node.id }

  getContent () {
    return this._node.content
  }

  getLabel () {
    return getLabel(this._node)
  }
}
