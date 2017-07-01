import CollectAffs from './CollectAffs'
import UnwrapBlockLevelElements from './UnwrapBlockLevelElements'

const trafos = [
  CollectAffs,
  UnwrapBlockLevelElements,
].map(C => new C())

export function j2r(dom) {
  for (let i = 0; i < trafos.length; i++) {
    trafos[i].import(dom)
  }
}

export function r2j(dom) {
  // nothing: restricted JATS is valid JATS
}
