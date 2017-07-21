import { unwrapChildren } from '../util/domHelpers'
import { TextureJATS } from '../../article'

export default class WrapAff {

  import(dom) {
    let articleMeta = dom.find('article-meta')
    let allAffs = dom.findAll('article-meta > aff')
    let affGroup = dom.createElement('aff-group')
    affGroup.append(allAffs)
    // now insert the aff-group at the correct position
    let articleMetaSchema = TextureJATS.getElementSchema('article-meta')
    let pos = articleMetaSchema.findFirstValidPos(articleMeta, 'aff-group')
    articleMeta.insertAt(pos, articleMeta)
  }

  export(dom) {
    let affGroup = dom.find('aff-group')
    unwrapChildren(affGroup)
  }
}
