import { ListPackage } from 'substance'

export default class XMLListNodeHTMLConverter extends ListPackage.ListHTMLConverter {

  _createItems(converter, node, items, types) {
    node._childNodes = items.map(d => {
      let listItem = converter.convertElement(d.el)
      listItem.attributes.level = d.level
      return listItem.id
    })
    node.attributes = node.attributes || {}
    node.attributes.type = types.join(',')
  }

}
