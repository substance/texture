import { renderListNode } from 'substance'

export default class ListConverter {
  get type () { return 'list' }

  get tagName () { return 'list' }

  import (el, node, importer) {
    let doc = importer.getDocument()
    let visited = new Set()
    let items = []
    let config = []
    this._extractItems(el, config, items, 0, visited)
    // create items
    let itemIds = items.map(item => {
      let { el, level } = item
      let li = doc.create({
        type: 'list-item',
        id: el.id
      })
      li.attr('level', level)
      let p = el.find('p')
      if (p) {
        li.content = importer.annotatedText(p, li.getPath())
        return li.id
      }
      return false
    }).filter(Boolean)
    // populate list
    node.id = el.id
    node.attributes = { 'list-type': config.join(',') }
    node._childNodes = itemIds
  }

  _extractItems (el, config, items, level, visited) {
    if (el.is('list-item')) items.push({ el, level })
    if (el.is('list')) {
      let listType = el.attr('list-type') || 'bullet'
      if (!config[level]) config[level] = listType
      level++
      visited.add(el)
    }
    el.getChildren().forEach(c => this._extractItems(c, config, items, level, visited))
  }

  // ATTENTION: this is pretty rudimentary still
  export (node, el, exporter) {
    const $$ = exporter.$$
    let newList = renderListNode(node, (arg) => {
      if (arg === 'ol') {
        return $$('list').attr('list-type', 'order')
      } else if (arg === 'ul') {
        return $$('list').attr('list-type', 'bullet')
      } else if (arg === 'li') {
        return $$('list-item')
      } else {
        return $$('list-item', {id: arg.id}).append(
          $$('p').setInnerXML(arg.getInnerXML())
        )
      }
    })
    newList.id = node.id
    return newList
  }
}
