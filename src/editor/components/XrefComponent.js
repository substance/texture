import { Component } from 'substance'
import { getXrefTargets } from '../util'

export default class XrefComponent extends Component {

  didMount() {
    this.context.labelGenerator.on('labels:generated', this.rerender, this)
  }

  dispose() {
    this.context.labelGenerator.off(this)
  }

  render($$) {
    let node = this.props.node
    let refType = node.attributes['ref-type']
    let el = $$('span').addClass('sc-xref')
    let labelGenerator = this.context.labelGenerator
    let targets = getXrefTargets(node)
    let generatedLabel = labelGenerator.getLabel(refType, targets)
    el.append(generatedLabel)
    el.addClass('sm-'+node.referenceType)
    return el
  }
}
