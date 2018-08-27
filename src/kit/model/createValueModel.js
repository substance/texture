import BooleanModel from './BooleanModel'
import NumberModel from './NumberModel'
import StringModel from './StringModel'
import TextModel from './TextModel'
import ObjectModel from './ObjectModel'
import ChildModel from './ChildModel'
import ChildrenModel from './ChildrenModel'
import SingleRelationshipModel from './SingleRelationshipModel'
import ManyRelationshipModel from './ManyRelationshipModel'
import AnyModel from './AnyModel'

export default function createValueModel (api, type, path, targetTypes) {
  let valueModel
  switch (type) {
    case 'boolean': {
      valueModel = new BooleanModel(api, path)
      break
    }
    case 'number': {
      valueModel = new NumberModel(api, path)
      break
    }
    case 'string': {
      valueModel = new StringModel(api, path)
      break
    }
    case 'text': {
      valueModel = new TextModel(api, path)
      break
    }
    case 'object': {
      valueModel = new ObjectModel(api, path)
      break
    }
    case 'child': {
      valueModel = new ChildModel(api, path, targetTypes)
      break
    }
    case 'children': {
      valueModel = new ChildrenModel(api, path, targetTypes)
      break
    }
    case 'many-relationship': {
      valueModel = new ManyRelationshipModel(api, path, targetTypes)
      break
    }
    case 'single-relationship': {
      valueModel = new SingleRelationshipModel(api, path, targetTypes)
      break
    }
    default:
      valueModel = new AnyModel(api, path)
  }
  return valueModel
}
