import { TextureArticle, DarArticle } from '../../article'

export default class UpdateDocType {

  import(dom) {
    dom.setDoctype(
      ...TextureArticle.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDoctype(
      ...DarArticle.getDocTypeParams()
    )
  }
}
