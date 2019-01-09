/*
  Creates empty ref-list if there is no one
  and removes everything except refs from existing ref-list.
*/
export default class RefList {
  import (dom) {
    let refLists = dom.findAll('ref-list')
    if (refLists.length > 0) {
      refLists.forEach(refList => {
        let refs = refList.findAll('ref')
        refList.empty()
        refList.append(refs)
      })
    } else {
      let back = dom.find('back')
      back.append(
        dom.createElement('ref-list')
      )
    }
  }

  export () {
    // nothing
  }
}
