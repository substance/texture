import { Component } from 'substance'

/*
  Simplistic back-matter displaying references and appendixes
*/
export default class SimpleBackComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div').addClass('sc-back')
      .attr('data-id', node.id)

    return el
  }

}