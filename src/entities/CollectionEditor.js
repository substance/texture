import { Component } from 'substance'
import EntityEditor from './EntityEditor'

export default class CollectionEditor extends Component {
  render($$) {
    let el = $$('div').addClass('sc-collection-editor')
    let label = this.getLabel(this.props.model.type)
    let items = this._getItems()

    el.append(
      $$('div').addClass('se-header').append(items.length + ' ' + label)
    )

    items.forEach(item => {
      // let schema = this._getSchema(item.type)
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

  

}
