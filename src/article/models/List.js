import { DocumentNode, ListMixin, documentHelpers, STRING, CHILDREN } from 'substance'

export default class List extends ListMixin(DocumentNode) {
  createListItem (text) {
    let item = this.getDocument().create({ type: 'list-item', content: text, level: 1 })
    return item
  }

  getItems () {
    return documentHelpers.getNodesForIds(this.getDocument(), this.items)
  }

  getItemsPath () {
    return [this.id, 'items']
  }

  getItemAt (idx) {
    let doc = this.getDocument()
    return doc.get(this.items[idx])
  }

  getItemPosition (item) {
    return this.items.indexOf(item.id)
  }

  insertItemAt (pos, item) {
    documentHelpers.insertAt(this.getDocument(), this.getItemsPath(), pos, item.id)
  }

  removeItemAt (pos) {
    documentHelpers.removeAt(this.getDocument(), this.getItemsPath(), pos)
  }

  getLength () {
    return this.items.length
  }

  getListTypeString () {
    return this.listType
  }

  setListTypeString (listTypeStr) {
    let doc = this.getDocument()
    doc.set(this.getItemsPath(), listTypeStr)
  }
}

List.schema = {
  type: 'list',
  items: CHILDREN('list-item'),
  listType: STRING
}
