import { unwrapChildren } from '../util/domHelpers'
import { TextureJATS } from '../../article'

export default class WrapAff {

  import(dom) {
    let articleMeta = dom.find('article-meta')
    let allAffs = dom.findAll('article-meta > aff')
    if (allAffs.length > 0) {
      let affGroup = dom.createElement('aff-group')
      articleMeta.insertBefore(affGroup, allAffs[0])
      affGroup.append(allAffs)
    }
  }

  export(dom) {
    let affGroup = dom.find('aff-group')
    if (affGroup) {
      unwrapChildren(affGroup)
    }
  }
}
