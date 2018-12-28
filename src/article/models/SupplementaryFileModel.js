import { getLabel } from '../shared/nodeHelpers'
import NodeModel from '../../kit/model/NodeModel'

export default class SupplementaryFileModel extends NodeModel {
  getLabel () {
    return getLabel(this._node)
  }

  getLegend () {
    return this._api.getModelById(this._node.legend)
  }
}
