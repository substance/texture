import NormalizeFn from './NormalizeFn'
import NormalizeContribGroup from './NormalizeContribGroup'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import NormalizeRefList from './NormalizeRefList'
import { TEXTURE_JATS_PUBLIC_ID, TEXTURE_JATS_DTD, JATS_GREEN_1_2_PUBLIC_ID, JATS_GREEN_1_DTD } from '../../../ArticleConstants'

const trafos = [
  NormalizeContribGroup,
  NormalizeFn,
  NormalizeRefList,
  UnwrapBlockLevelElements
].map(C => new C())

export default class JATSTransformer {
  import (jatsDom) {
    // TODO: we should create some kind of report
    trafos.forEach(t => t.import(jatsDom))
    // update the docType so that the rest of the system knows that this should be
    // interpreted as Texture JATS now
    jatsDom.setDoctype('article', TEXTURE_JATS_PUBLIC_ID, TEXTURE_JATS_DTD)
    return jatsDom
  }

  export (jatsDom) {
    // set the doctype to the JATS format which we want to produce
    jatsDom.setDoctype('article', JATS_GREEN_1_2_PUBLIC_ID, JATS_GREEN_1_DTD)
  }
}
