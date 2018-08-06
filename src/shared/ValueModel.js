import { isNil } from 'substance'

export class ValueModel {
  constructor (api, path) {
    this._api = api
    this._path = path
  }

  get id () {
    return String(this._path)
  }

  getValue () {
    return this._api._getValue(this._path)
  }

  setValue (val) {
    this._api._setValue(this._path, val)
  }

  isEmpty () {
    return isNil(this.getValue())
  }

  get _value () { return this.getValue() }
}

export class BooleanModel extends ValueModel {
  get type () { return 'boolean-model' }

  // Note: Nil is interpreted as false, and false is thus also interpreted as isEmpty()
  isEmpty () {
    return !this.getValue()
  }
}

export class NumberModel extends ValueModel {
  get type () { return 'number-model' }
}

export class StringModel extends ValueModel {
  get type () { return 'string-model' }

  isEmpty () {
    let value = this.getValue()
    return isNil(value) || value.length === 0
  }
}

export class ObjectModel extends ValueModel {
  get type () { return 'object-model' }
}

export class TextModel extends StringModel {
  get type () { return 'text-model' }
}

export class RelationshipModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  getAvailableTargets () {
    return _getAvailableRelationshipOptions(this._api, this._targetTypes)
  }
}

export class SingleRelationshipModel extends RelationshipModel {
  get type () { return 'single-relationship-model' }

  toggleTarget (target) {
    let currentTargetId = this.getValue()
    let newTargetId
    if (currentTargetId === target.id) {
      newTargetId = undefined
    } else {
      newTargetId = target.id
    }
    this._api._setValue(this._path, newTargetId)
  }
}

export class ManyRelationshipModel extends RelationshipModel {
  get type () { return 'many-relationship-model' }

  getValue () {
    return super.getValue() || []
  }

  isEmpty () {
    return this.getValue().length === 0
  }

  toggleTarget (target) {
    this._api._toggleRelationship(this._path, target.id)
  }
}

export class ChildrenModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  get type () { return 'children-model' }

  getValue () {
    return super.getValue() || []
  }

  getChildren () {
    return this.getValue().map(id => this._api._getModelById(id))
  }

  isEmpty () {
    return this.getValue().length === 0
  }

  appendChild (child) {
    this._api._appendChild(this._path, child)
  }

  removeChild (child) {
    this._api._removeChild(this._path, child)
  }
}

// TODO: at this higher level, 'Container' is not a very good name because ot is not very specific
// We should come up with a name that makes clear that this is something that could be editied in a classical 'word-processor'.
// I.e. the content consists of a sequence of TextBlocks as well as blocks with other typically structured content.
// As a working title I'd suggest to use the term 'flow content' which is used in HTML for exactly this type of content
export class FlowContentModel extends ChildrenModel {
  // ATTENTION: the current implementation relies heavily on the model's node being a ContainerNode
  // TODO: it would be good if we could find a way to get ContainerEditing implemented on a path instead of a node
  get id () { return this._path[0] }
  get type () { return 'flow-content-model' }
}

function _getAvailableRelationshipOptions (api, targetTypes) {
  let items = targetTypes.reduce((items, targetType) => {
    let collection = api.getCollectionForType(targetType)
    return items.concat(collection.getItems())
  }, [])
  return items.map(item => _getRelationshipOption(api, item.id))
}

function _getRelationshipOption (api, id) {
  return {
    id,
    toString () {
      return api.renderEntity(api._getModelById(id))
    }
  }
}
