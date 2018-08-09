import InternalArticleSchema from '../../InternalArticleSchema'
import TextureArticle from '../../TextureArticle'

export default class UpdateDocType {

  import(dom) {
    dom.setDoctype(
      ...InternalArticleSchema.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDoctype(
      ...TextureArticle.getDocTypeParams()
    )
  }
}
