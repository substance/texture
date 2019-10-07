import { $$, Component, getKeyForPath, ContainerEditor, isNil } from 'substance'
import _renderNode from './_renderNode'

export default class CollectionComponent extends Component {
  render () {
    const props = this.props
    const { container, path } = props
    let renderAsContainer
    if (!isNil(container)) {
      renderAsContainer = Boolean(container)
    }
    if (renderAsContainer) {
      return $$(EditableCollection, Object.assign({}, props, {
        containerPath: path
      }))
    } else {
      return $$(ReadOnlyCollection, props)
    }
  }
}

class ReadOnlyCollection extends Component {
  // NOTE: this is less efficient than ContainerEditor as it will always render the whole collection
  render () {
    const { document, path, disabled } = this.props
    const el = $$('div').addClass('sc-collection').attr('data-id', getKeyForPath(path))
    const items = document.resolve(path)
    el.append(
      items.map(item => _renderNode(this, item, { disabled }).ref(item.id))
    )
    return el
  }
}

class EditableCollection extends ContainerEditor {
  _getClassNames () {
    return 'sc-collection sc-container-editor sc-surface'
  }
}
