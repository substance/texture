import Model from './Model'
import throwMethodIsAbstract from '../shared/throwMethodIsAbstract'

export default class Collection extends Model {
  get isCollection () {
    return true
  }

  // TODO: change naming. Is the collection removable? probably rather an item. If it an item is removable the collection is mutable.
  get isRemovable () {
    return false
  }

  // TODO: change naming. Again, this sounds more like item isMovable() which in terms of the collection could be described isOrdered()
  // i.e. user can change order
  get isMovable () {
    return false
  }

  get length () {
    throwMethodIsAbstract()
  }

  getItems () {
    throwMethodIsAbstract()
  }

  addItem (item = {}) {
    throwMethodIsAbstract()
  }

  addItems (items) {
    throwMethodIsAbstract()
  }

  removeItem (item) {
    throwMethodIsAbstract()
  }
}
