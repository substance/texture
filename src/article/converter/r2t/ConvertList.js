import { renderListNode } from 'substance'

export default class ConvertList {
  // ATTENTION: this is pretty rudimentary still
  import (dom) {
    const $$ = dom.createElement.bind(dom)
    let lists = dom.findAll('list')
    let visited = new Set()
    lists.forEach(list => {
      if (visited.has(list)) return
      let config = []
      let items = []
      this._extractItems(list, config, items, 0, visited)
      items = items.map(item => {
        let { el, level } = item
        let li = $$('list-item')
        li.id = el.id
        li.attr('level', level)
        let p = el.find('p')
        if (p) {
          li.append(p.getChildNodes())
          return li
        }
        return false
      }).filter(Boolean)
      let newList = $$('list')
        .attr('id', list.id)
        .attr('list-type', config.join(','))
        .append(items)
      list.parentNode.replaceChild(list, newList)
    })
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
  export (dom, { doc }) {
    const $$ = dom.createElement.bind(dom)
    dom.findAll('list').forEach(list => {
      let listNode = doc.get(list.id)
      // ATTENTION: XMLDocumentNodes do have a similar
      // as DOMElements. But there are still slight differences
      let newList = renderListNode(listNode, (arg) => {
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
      newList.id = list.id
      list.parentNode.replaceChild(list, newList)
    })
  }
}
