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

export function jats2restrictedJats (dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}
