import ValueModel from './ValueModel'

export default class BooleanModel extends ValueModel {
  get type () { return 'boolean' }

  // Note: Nil is interpreted as false, and false is thus also interpreted as isEmpty()
  isEmpty () {
    return !this.getValue()
  }
}
