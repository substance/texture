import { Component } from 'substance'

/*
  Simplistic back-matter displaying references and appendixes
*/
export default class BackComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div').addClass('sc-back')
      .attr('data-id', node.id)

    // NOTE: Bibliography depends on entityDb and referenceManager in the context.
    let refList = node.find('ref-list')
    if (refList) {
      el.append(
        $$(this.getComponent('ref-list'), { node: refList }).ref('ref-list')
      )
    }

    let fnGroup = node.find('fn-group')
    if (fnGroup) {
      el.append(
        $$(this.getComponent('fn-group'), { node: fnGroup }).ref('fn-group')
      )
    }
    return el
  }

}
