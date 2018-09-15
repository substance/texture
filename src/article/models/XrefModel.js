import { getXrefTargets, getAvailableXrefTargets } from '../shared/xrefHelpers'

export default class XrefModel {
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id () {
    return this._node.id
  }

  getTargets () {
    let targetIds = getXrefTargets(this._node)
    return targetIds.map(id => this._api.getModelById(id))
  }

  getAvailableTargets () {
    // ATTENTION: getAvailableXrefTargets() provides an internal entry of records
    let entries = getAvailableXrefTargets(this._node, { api: this._api })
    return entries.map(entry => {
      entry.model = this._api.getModelById(entry.id)
      return entry
    })
  }

  toggleTarget (nodeId) {
    this._api.toggleXrefTarget(nodeId, this)
    return this.getAvailableTargets()
  }
}
