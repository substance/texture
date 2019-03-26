import ValueModel from './ValueModel'

export default class EnumModel extends ValueModel {
  get type () { return 'enum' }
}
