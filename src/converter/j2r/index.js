import PruneText from './PruneText'
import CollectAffs from './CollectAffs'
import NormalizeFn from './NormalizeFn'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import EmptyRefList from './EmptyRefList'
// import HomogenizeSigBlocks from './HomogenizeSigBlocks'
import WrapSig from './WrapSig'

const trafos = [
  // HomogenizeSigBlocks,
  WrapSig,
  NormalizeFn,
  EmptyRefList,
  UnwrapBlockLevelElements,
  PruneText,
  // ATTENTION: all converters which require schema sensitive insertion
  // need to go after PruneText, as otherwise the our validator
  // considers all TextNodes as a violation
  CollectAffs,
].map(C => new C())

export function j2r(dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}
