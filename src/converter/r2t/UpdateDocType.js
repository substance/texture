import { TextureJATS, DarArticle } from '../../article'

export default class UpdateDocType {

  import(dom) {
    dom.setDocType(
      ...TextureJATS.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDocType(
      ...DarArticle.getDocTypeParams()
    )
  }
}
