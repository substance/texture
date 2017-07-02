import CollectAffs from './CollectAffs'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'
import HomogenizeSigBlocks from './HomogenizeSigBlocks'

const trafos = [
  CollectAffs,
  UnwrapBlockLevelElements,
  HomogenizeSigBlocks
].map(C => new C())

export function j2r(dom, api) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom, api)
  }
}

export function r2j(dom) {
  // nothing: restricted JATS is valid JATS
}
