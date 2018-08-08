import { isNil } from 'substance'
import ValueModel from './ValueModel'

export default class StringModel extends ValueModel {
  get type () { return 'string-model' }

  isEmpty () {
    let value = this.getValue()
    return isNil(value) || value.length === 0
  }
}
