import PruneText from './PruneText'
import NormalizeFn from './NormalizeFn'
import NormalizeContribGroup from './NormalizeContribGroup'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import RefList from './RefList'
// import HomogenizeSigBlocks from './HomogenizeSigBlocks'
import WrapSig from './WrapSig'

const trafos = [
  // HomogenizeSigBlocks,
  WrapSig,
  NormalizeContribGroup,
  NormalizeFn,
  RefList,
  UnwrapBlockLevelElements,
  PruneText,
  // ATTENTION: all converters which require schema sensitive insertion
  // need to go after PruneText, as otherwise the our validator
  // considers all TextNodes as a violation
].map(C => new C())

export function j2r(dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}

export {
  PruneText,
  NormalizeFn,
  UnwrapBlockLevelElements,
  RefList,
  WrapSig
}
