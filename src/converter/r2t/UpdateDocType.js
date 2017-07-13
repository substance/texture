import { TextureJATS, JATS4R } from '../../article'

export default class UpdateDocType {

  import(dom) {
    dom.setDocType(
      ...TextureJATS.getDocTypeParams()
    )
  }

  export(dom) {
    dom.setDocType(
      ...JATS4R.getDocTypeParams()
    )
  }
}
