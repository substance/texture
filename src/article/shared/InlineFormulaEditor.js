import { Component } from 'substance'

/**
 * Tool to edit the markup of an InlineFormula.
 */
export default class InlineFormulaEditor extends Component {
  render ($$) {
    const TextPropertyEditor = this.getComponent('text-property-editor')
    const node = this.props.node
    let el = $$('div').addClass('sc-inline-formula-editor').addClass('sm-horizontal-layout')
    let contentEditor = $$(TextPropertyEditor, {
      type: 'text',
      path: [node.id, 'content'],
      placeholder: this.getLabel('enter-formula')
    }).ref('editor')
      .addClass('sm-monospace')
    el.append(
      contentEditor
    )
    return el
  }
}
