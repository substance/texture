import InternalArticle from '../../InternalArticle'
import TextureArticle from '../../TextureArticle'

export default class UpdateDocType {

  import(dom) {
    dom.setDoctype(
      ...InternalArticle.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDoctype(
      ...TextureArticle.getDocTypeParams()
    )
  }
}
