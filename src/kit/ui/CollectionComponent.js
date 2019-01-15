import { Component } from 'substance'
import ContainerEditor from './_ContainerEditor'
import ValueComponent from './ValueComponent'
import renderNode from './_renderNode'

/**
 * A component that renders a CHILDREN value.
 *
 * Note: I decided to use the name Collection here as from the application point of view a CHILDREN field is a collection.
 */
export default class CollectionComponent extends Component {
  render ($$) {
    const props = this.props
    const model = props.model
    let renderAsContainer
    if (props.hasOwnProperty('container')) {
      renderAsContainer = Boolean(props.container)
    } else {
      renderAsContainer = model.getSchema().isContainer()
    }
    if (renderAsContainer) {
      return $$(EditableCollection, Object.assign({}, props, {
        containerPath: props.model.getPath()
      })).ref('editor')
    } else {
      return $$(ReadOnlyCollection, props).ref('diplay')
    }
  }
}

class ReadOnlyCollection extends ValueComponent {
  // TODO: this is less efficient than ContainerEditor as it will always render the whole collection
  render ($$) {
    let props = this.props
    let model = props.model
    let el = $$('div').addClass('sc-collection').attr('data-id', model.getPath().join('.'))
    let items = model.getItems()
    el.append(
      items.map(item => renderNode($$, this, item, { disabled: props.disabled }).ref(item.id))
    )
    return el
  }
}

class EditableCollection extends ContainerEditor {
  _getClassNames () {
    return 'sc-collection sc-container-editor sc-surface'
  }
}
