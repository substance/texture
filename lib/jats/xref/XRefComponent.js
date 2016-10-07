'use strict';

import { Component, TextPropertyEditor } from 'substance'

class XRefComponent extends Component {

  render($$) { // eslint-disable-line
    let node = this.props.node
    let el = $$('span').addClass('sc-xref')

    let labelEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      tagName: 'span',
      path: [node.id, 'label'],
      withoutBreak: true
    }).ref('labelEditor')
    el.append(labelEditor)

    el.addClass('sm-'+node.referenceType)
    return el
  }
}

export default XRefComponent
