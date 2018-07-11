import DefaultModel from './DefaultModel'
import { getLabel } from '../../editor/util/nodeHelpers'
import { updateModel } from './modelHelpers'

export default class ReferenceModel extends DefaultModel {

  getLabel() {
    return getLabel(this._node)
  }

  toJSON() {
    let json = super.toJSON()
    json.label = this.getLabel()
    return json
  }

  update(props) {
    updateModel(this, props)
  }

  addContrib(propName) {
    let id = this.id
    let length = this._node[propName].length
    this._api.pubMetaDbSession.transaction(tx => {
      let newNode = tx.create({
        type: 'ref-contrib'
      })
      tx.update([id, propName], { type: 'insert', pos: length, value: newNode.id })
    })
  }

  removeContrib(propName, contribId) {
    let id = this.id
    let pos = this._node[propName].indexOf(contribId)
    if (pos !== -1) {
      this._api.pubMetaDbSession.transaction(tx => {
        tx.update([id, propName], { type: 'delete', pos: pos })
      })
    }
  }

  updateContrib(contribId, propName, value) {
    this._api.pubMetaDbSession.transaction(tx => {
      tx.set([contribId, propName], value)
    })
  }

}

