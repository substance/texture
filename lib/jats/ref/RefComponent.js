import { Component } from 'substance'
import refToHTML from './refToHTML'

class RefComponent extends Component {
  render($$) {
    var el = $$('div').addClass('sc-ref')
    el.attr('data-id', this.props.node.id)
    el.html(refToHTML(this.props.node).textContent)
    return el
  }
}

// Isolated Nodes config
RefComponent.fullWidth = true
RefComponent.noStyle = true

export default RefComponent
