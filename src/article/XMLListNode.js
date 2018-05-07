import { XMLElementNode, ListMixin } from 'substance'

export default
class XMLListNode extends ListMixin(XMLElementNode) {

  createListItem(text) {
    let item = this.getDocument().create({ type: 'list-item', content: text })
    item.attr('level', 1)
    return item
  }

  getItemsPath() {
    return [this.id, '_childNodes']
  }

  get items() { return this._childNodes }

  getItems() {
    return this.getChildren()
  }

  getItemAt(idx) {
    return this.getChildAt(idx)
  }

  getItemPosition(item) {
    return this.getChildPosition(item)
  }

  insertItemAt(pos, item) {
    return this.insertAt(pos, item)
  }

  appendItem(item) {
    return this.appendChild(item)
  }

  removeItemAt(pos) {
    this.removeAt(pos)
  }

  getLength() {
    return this.getChildCount()
  }

  getLevelSpecs() {
    let typeSpec = this.attr('type')
    if (typeSpec) {
      let specs = typeSpec.split(',')
      return specs.map(s => {
        s = s.trim()
        if (s === 'ordered') {
          return { type: 'ordered' }
        } else {
          return { type: 'unordered'}
        }
      })
    } else {
      return []
    }
  }

}

XMLListNode.type = 'list'
