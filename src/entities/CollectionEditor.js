import { Component, FontAwesomeIcon } from 'substance'
import EntityEditor from './EntityEditor'

export default class CollectionEditor extends Component {
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

    items.forEach(item => {
      el.append(
        $$(EntityEditor, {
          model: item
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
}
