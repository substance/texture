import { InternalArticle, TextureArticle } from '../../article'

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
