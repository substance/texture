import PruneText from './PruneText'
import CollectAffs from './CollectAffs'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import HomogenizeSigBlocks from './HomogenizeSigBlocks'

const trafos = [
  PruneText,
  CollectAffs,
  UnwrapBlockLevelElements,
  HomogenizeSigBlocks
].map(C => new C())

export function j2r(dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}
