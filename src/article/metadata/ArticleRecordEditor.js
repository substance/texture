import NodeModelComponent from '../shared/NodeModelComponent'
import LicenseEditor from '../shared/LicenseEditor'

export default class ArticleRecordEditor extends NodeModelComponent {
  _getClassNames () {
    return `sc-article-record sc-node-model`
  }

  get isRemovable () {
    return false
  }

  _renderHeader () {
    // no header
  }

  _getPropertyEditorClass (property) {
    switch (property.name) {
      // don't provide an editor for 'authors' and 'editors'
      // these fields are managed in dedicated metadata sections
      case 'authors':
      case 'editors': {
        return null
      }
      case 'license': {
        return LicenseEditor
      }
      default:
        return super._getPropertyEditorClass(property)
    }
  }

  _getProperties () {
    let model = this.props.model
    let permission = model.getPermission()
    let properties = model.getProperties()
    properties = properties.filter(p => p.name !== 'permission')
    properties = properties.concat(permission.getProperties())
    return properties
  }
}
