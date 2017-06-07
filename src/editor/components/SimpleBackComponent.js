import { Component } from 'substance'

/*
  Simplistic back-matter displaying references and appendixes
*/
export default class SimpleBackComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div').addClass('sc-back')
      .attr('data-id', node.id)

    // TODO: show all, or think about how to render the whole back matter

    let refList = node.find('ref-list')
    if (refList) {
    	el.append(
    		$$(this.getComponent('ref-list'), { node })
    	)
    }

    return el
  }

}