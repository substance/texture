import { Component } from 'substance'
import refToHTML from './refToHTML'

/*
  Renders a keyboard-selectable ref target item
*/
class RefTarget extends Component {

  render($$) {
    let el = $$('div')
      .addClass('sc-ref-target')
      .attr({'data-id': this.props.node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }
    let node = this.props.node
    el.html(refToHTML(node))
    return el
  }
}

export default RefTarget
