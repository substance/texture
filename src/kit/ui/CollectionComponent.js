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
    if (props.container) {
      // FIXME: there is a bug with redirected components (they do not get disposed correctly)
      return $$(EditableCollection, {
        name: props.name,
        containerPath: props.model.getPath(),
        disabled: props.disabled
      }).ref('editor')
    } else {
      return $$(ReadOnlyCollection, {
        model: props.model,
        disabled: props.disabled
      }).ref('diplay')
    }
  }
}

class ReadOnlyCollection extends ValueComponent {
  // TODO: this is less efficient than ContainerEditor as it will always render the whole collection
  render ($$) {
    let props = this.props
    let el = $$('div').addClass('sc-collection')
    let items = props.model.getItems()
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
