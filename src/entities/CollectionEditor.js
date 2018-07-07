import { Component } from 'substance'
import EntityEditor from './EntityEditor'

export default class CollectionEditor extends Component {
  render($$) {
    let el = $$('div').addClass('sc-collection-editor')
    let label = this.getLabel(this.props.collection)
    
    el.append(
      $$('div').addClass('se-header').append(label)
    )

    let items = this._getItems()
    items.forEach(item => {
      let schema = this._getSchema(item.type)
      el.append(
        $$(EntityEditor, {
          model: item,
          schema: schema
        }) 
      )
    })
  }
  
  _getItems() {
    return this.context.api.getCollection(this.props.collection)
  }

  _getSchema(itemType) {
    return this.context.api.getSchema(itemType)
  }
}
