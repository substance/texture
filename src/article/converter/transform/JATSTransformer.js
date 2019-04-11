import PruneText from './PruneText'
import NormalizeFn from './NormalizeFn'
import NormalizeContribGroup from './NormalizeContribGroup'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import NormalizeRefList from './NormalizeRefList'

const trafos = [
  NormalizeContribGroup,
  NormalizeFn,
  NormalizeRefList,
  UnwrapBlockLevelElements,
  PruneText
].map(C => new C())

export default class JATSTransformer {
  import (jatsDom) {
    // TODO: we should create some kind of report
    trafos.forEach(t => t.import(jatsDom))
    return jatsDom
  }

  export () {
    // nothing yet
  }
}
