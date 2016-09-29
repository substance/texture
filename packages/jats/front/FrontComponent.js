import { Component } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

class FrontComponent extends Component {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-front')
      .attr('data-id', this.props.node.id)

    // Render articlemeta
    let articleMeta = doc.get(node.articleMeta)

    el.append(
      renderNodeComponent(this, $$, articleMeta, {
        disabled: this.props.disabled
      })
    )

    return el
  }
}

export default FrontComponent
