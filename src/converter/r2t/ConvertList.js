import { renderListNode } from 'substance'

export default class ConvertList {

  // ATTENTION: this is pretty rudimentary still
  import(dom) {
    const $$ = dom.createElement.bind(dom)
    let lists = dom.findAll('list')
    let visited = new Set()
    lists.forEach(list => {
      // skip nested lists which have been traversed already
      if (visited.has(list)) return
      visited.add(list)
      let config = []
      let items = []
      this._walkList(list, (el, level) => {
        if (el.is('list') && !config[level]) {
          let listType = el.attr('list-type') || 'bullet'
          config[level] = listType
          visited.add(el)
        } else if (el.is('list-item')) {
          let firstChild = el.firstChild
          if (firstChild.is('p')) {
            let li = $$('list-item')
            li.id = el.id
            li.attr('level', 1)
            li.append(firstChild.getChildNodes())
            items.push(li)
          } else {
            throw new Error(`list-item > ${firstChild.tagName} is not supported`)
          }
        }
      })
      let newList = dom.createElement('list')
      newList.id = list.id
      newList.append(items)
      config = config.map(s => s || 'bullet')
      newList.attr('type', config.join(','))
      list.parentNode.replaceChild(list, newList)
    })
  }

  _walkList(el, cb, level = 0) {
    cb(el, level)
    if (el.is('list')) {
      let children = el.getChildren()
      children.forEach(c => {
        this._walkList(c, cb, level+1)
      })
    }
  }

  // ATTENTION: this is pretty rudimentary still
  export(dom, { doc }) {
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
        } else {
          let listItem = arg
          return $$('list-item', {id: listItem.id }).append(
            $$('p').setInnerXML(listItem.getInnerXML())
          )
        }
      })
      newList.id = list.id
      list.parentNode.replaceChild(list, newList)
    })
  }
}

