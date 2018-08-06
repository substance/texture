import { Component } from 'substance'
import CardComponent from '../shared/CardComponent'
import EntityEditor from '../shared/EntityEditor'

export default class CollectionEditor extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'remove-item': this._removeCollectionItem
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-collection-editor')
    let label = this.getLabel(this.props.model.id)
    let items = this._getItems()

    el.append(
      $$('div').addClass('se-heading').append(
        $$('div').addClass('se-header').append(label)
      )
    )

    items.forEach(item => {
      let ItemEditor = this.getComponent(item.type, true) || EntityEditor
      el.append(
        $$(CardComponent).append(
          $$(ItemEditor, {
            model: item,
            // LEGACY:
            node: item._node
          })
        )
      )
    })

    return el
  }

  _getItems() {
    return this.props.model.getItems()
  }

  _removeCollectionItem(item) {
    this.props.model.removeItem(item)
    this.rerender()
  }
}
