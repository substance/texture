import { unwrapChildren } from '../util/domHelpers'

export default class WrapTransAbstracts {

  import(dom) {
    let articleMeta = dom.find('article-meta')
    let transAbstracts = articleMeta.findAll('trans-abstract')
    if (transAbstracts.length >0) {
      let transAbstractGroup = dom.createElement('trans-abstract-group')
      articleMeta.insertBefore(transAbstractGroup, transAbstracts[0])
      transAbstractGroup.append(transAbstracts)
    }
  }

  export(dom) {
    let transAbstractGroup = dom.find('article-meta > trans-abstract-group')
    if (transAbstractGroup) {
      unwrapChildren(transAbstractGroup)
    }
  }
}
