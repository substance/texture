export default class PruneEmptyElements {

  import(dom) {
    // usually nothing to do here
  }

  export(dom) {
    let emptyEls = dom.findAll('break')
    emptyEls.forEach(el => {
      el.empty()
    })
  }
}
