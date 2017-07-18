import { unwrapChildren } from '../util/domHelpers'
import { TextureJATS } from '../../article'

export default class WrapAff {

  import(dom) {
    let articleMeta = dom.find('article-meta')
    let allAffs = dom.findAll('aff')
    let affGroup = dom.createElement('aff-group')
    affGroup.append(allAffs)

    let articleMetaSchema = TextureJATS.getElementSchema('article-meta')
    let pos = articleMetaSchema.findFirstValidPos(articleMeta, 'aff-group')
    articleMeta.insertAt(pos, articleMeta)
  }

  export(dom) {
    let affGroup = dom.find('aff-group')
    unwrapChildren(affGroup)
  }
}
