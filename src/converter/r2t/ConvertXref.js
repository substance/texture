export default class ConvertXref {

  import() {
    // nop
  }

  export(dom, {doc}) {
    let xrefs = dom.findAll('xref')
    xrefs.forEach(xref => {
      let xrefNode = doc.get(xref.id)
      let label = xrefNode.state.label
      xref.textContent = label
    })
  }
}
