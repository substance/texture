import { TextureArticle, DarArticle } from '../../article'

export default class UpdateDocType {

  import(dom) {
    dom.setDocType(
      ...TextureArticle.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDocType(
      ...DarArticle.getDocTypeParams()
    )
  }
}
