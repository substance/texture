import { Component, FontAwesomeIcon } from 'substance'
import EntityEditor from './EntityEditor'

export default class CollectionEditor extends Component {
  render($$) {
    let el = $$('div').addClass('sc-collection-editor')
    let label = this.getLabel(this.props.model.id)
    let items = this._getItems()

    el.append(
      $$('div').addClass('se-header').append(items.length + ' ' + label)
    )

    items.forEach(item => {
      el.append(
        $$(EntityEditor, {
          model: item
        })
      )
    })

    el.append(
      $$('button').addClass('se-add-value')
        .append(
          $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon'),
          'Add ' + label
        )
        .on('click', this._addCollectionItem)
    )

    return el
  }
  
  _getItems() {
    return this.props.model.getItems()
  }

  _addCollectionItem() {
    
  }
}
