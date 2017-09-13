export default class FnGroupConverter {
  import(dom) {
    let fnGroups = dom.findAll('fn-group')
    if(fnGroups.length === 0) {
      let back = dom.find('back')
      back.append(
        dom.createElement('fn-group')
      )
    }
  }

  export(dom) {
    dom.findAll('fn-group').forEach(fnGroup => {
      if(fnGroup.children.length === 0) {
        fnGroup.getParent().removeChild(fnGroup)
      }
    })
  }
}