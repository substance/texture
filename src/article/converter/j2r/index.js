import PruneText from './PruneText'
import NormalizeFn from './NormalizeFn'
import NormalizeContribGroup from './NormalizeContribGroup'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import RefList from './RefList'
import WrapSig from './WrapSig'

const trafos = [
  WrapSig,
  NormalizeContribGroup,
  NormalizeFn,
  RefList,
  UnwrapBlockLevelElements,
  PruneText
].map(C => new C())

export function jats2restrictedJats (dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}
