import { replaceWith } from '../util/domHelpers'

export default class ConvertList {

  import(dom) {
    let lists = dom.findAll('list')
    lists.forEach(list => {
      let newChildren = []
      // TODO this needs more exp
      // for now we just turn list-item > p into list-item
      // but we will need support for nested lists as well
      debugger
      list.children.forEach(c => {
        if (c.tagName === 'list-item') {
          let el = c.children[0]
          if (el.tagName === 'p') {
            let li = dom.createElement('list-item')
            li.attr('level', 1)
            li.append(el.childNodes)
            newChildren.push(li)
            list.replaceChild(c, li)
          }
        }
      })
    })
  }

  export() {
    console.log('TODO: export list')
  }
}

