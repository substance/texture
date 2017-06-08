import { Component } from 'substance'

class XRefComponent extends Component {

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
    let generatedLabel = labelGenerator.getLabel(refType, node.targets)
    el.append(generatedLabel)
    el.addClass('sm-'+node.referenceType)
    return el
  }
}

export default XRefComponent
