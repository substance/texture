'use strict';

import { Component, TextPropertyEditor } from 'substance'

class XRefComponent extends Component {

  didMount() {
    this.context.labelGenerator.on('labels:generated', this.rerender, this)
  }

  dispose() {
    this.context.labelGenerator.off(this)
  }

  render($$) { // eslint-disable-line
    let node = this.props.node
    let refType = node.attributes['ref-type']
    let el = $$('span').addClass('sc-xref')

    let labelGenerator = this.context.labelGenerator
    let generatedLabel = labelGenerator.getLabel(refType, node.targets)
    // let labelEditor = $$(TextPropertyEditor, {
    //   disabled: this.props.disabled,
    //   tagName: 'span',
    //   path: [node.id, 'label'],
    //   withoutBreak: true
    // }).ref('labelEditor')

    el.append(generatedLabel)

    el.addClass('sm-'+node.referenceType)
    return el
  }
}

export default XRefComponent
