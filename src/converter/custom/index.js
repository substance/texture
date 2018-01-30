import Hackz from './Hackz'

const trafos = [
  Hackz
].map(C => new C())

const CUSTOM = {
  import(dom, api) {
    for (let i = 0; i < trafos.length; i++) {
      trafos[i].import(dom, api)
    }
  },
  export(dom, api) {
    for (let i = 0; i < trafos.length; i++) {
      trafos[i].export(dom, api)
    }
  }
}

export default CUSTOM
