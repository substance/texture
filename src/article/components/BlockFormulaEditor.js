import { Component, $$ } from 'substance'

export default class BlockFormulaEditor extends Component {
  render () {
    let el = $$('div').addClass('sc-block-formula-editor')
    const node = this.props.node

    let TextPropertyEditor = this.getComponent('text-property-editor')
    let editor = $$(TextPropertyEditor, {
      path: [node.id, 'content'],
      placeholder: this.getLabel('enter-formula'),
      multiLine: true
    }).ref('input')
    editor.addClass('se-editor')
    el.append(editor)

    return el
  }
}
