/*
  Creates empty ref-list if there is no one.
*/
export default class EmptyRefList {

  import(dom) {
    let refList = dom.find('ref-list')
    if(!refList) {
      let back = dom.find('back')
      back.append(
        dom.createElement('ref-list').append(
          dom.createElement('title').append('References')
        )
      )
    }
  }

  export() {
    // nothing
  }
}
