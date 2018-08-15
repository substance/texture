import { getLabel } from '../../shared/nodeHelpers'

export default class XrefConverter {
  get type () { return 'xref' }

  get tagName () { return 'xref' }

  import () {
    // nop
  }

  export (node, el, exporter) {
    let label = getLabel(node)
    if (label) {
      el.text(label)
    }
  }
}
