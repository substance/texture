import { Component } from 'substance'

import Bibliography from './Bibliography'

/*
  Simplistic back-matter displaying references and appendixes
*/
export default class BackComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div').addClass('sc-back')
      .attr('data-id', node.id)

    // NOTE: Bibliography depends on entityDb and referenceManager in the context.
    el.append(
      $$(Bibliography)
    )

    let fnGroup = node.find('fn-group')
    if (fnGroup) {
      el.append(
        $$(this.getComponent('fn-group'), { node })
      )
    }
    return el
  }

}
