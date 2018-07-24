import DefaultModel from './DefaultModel'
import { getLabel, getPos } from '../shared/nodeHelpers'

export default class FootnoteModel extends DefaultModel {
  get type () {
    return 'footnote'
  }

  getLabel () {
    return getLabel(this._node)
  }

  getPos () {
    return getPos(this._node)
  }
}
