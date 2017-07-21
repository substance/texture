export default class PruneEmptyElements {

  import() {
    // nothing to do here
  }

  export(dom) {
    let emptyEls = dom.findAll('break')
    emptyEls.forEach(el => {
      el.empty()
    })
  }
}
