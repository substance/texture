import ValueModel from './ValueModel'

// TODO: do we really need this?
export default class AnyModel extends ValueModel {
  get type () { return 'any' }
}
