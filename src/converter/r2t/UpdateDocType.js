import { InternalArticle, DarArticle } from '../../article'

export default class UpdateDocType {

  import(dom) {
    dom.setDoctype(
      ...InternalArticle.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDoctype(
      ...DarArticle.getDocTypeParams()
    )
  }
}
