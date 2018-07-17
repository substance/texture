import { Component, FontAwesomeIcon } from 'substance'

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
        $$('div').addClass('se-header').append(items.length + ' ' + label),
        $$('button').addClass('se-add-value')
          .append(
            $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon'),
            'Add ' + label
          )
          .on('click', this._addCollectionItem)
      )
    )

    const EntityEditor = this.getComponent('entity-editor')
    items.forEach(item => {
      let ItemEditor = this.getComponent(item.type, true) || EntityEditor
      el.append(
        $$(ItemEditor, {
          model: item,
          // LEGACY:
          node: item._node
        })
      )
    })

    return el
  }

  _getItems() {
    return this.props.model.getItems()
  }

  _addCollectionItem() {
    this.props.model.addItem()
    this.rerender()
  }

  _removeCollectionItem(item) {
    this.props.model.removeItem(item)
    this.rerender()
  }
}
