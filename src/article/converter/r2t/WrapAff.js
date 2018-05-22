import { unwrapChildren } from '../util/domHelpers'
import { insertChildAtFirstValidPos } from './r2tHelpers'

export default class WrapAff {

  import(dom) {
    let articleMeta = dom.find('article-meta')
    let allAffs = dom.findAll('article-meta > aff')
    let affGroup = dom.createElement('aff-group')
    // TODO: if we had article-meta as interleave
    // we could be less careful with inserting the <aff-group>
    insertChildAtFirstValidPos(articleMeta, affGroup)
    affGroup.append(allAffs)
  }

  export(dom) {
    let affGroup = dom.find('aff-group')
    if (affGroup) {
      unwrapChildren(affGroup)
    }
  }
}
