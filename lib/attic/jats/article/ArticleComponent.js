import { Component } from 'substance'
import renderNodeComponent from '../../util/renderNodeComponent'

class ArticleComponent extends Component {

  render($$) {
    let article = this.props.node
    let doc = node.getDocument()
    let configurator = this.props.configurator
    let el = $$('div')
      .addClass('sc-article')
      .attr('data-id', this.props.node.id)

    // Render front
    let front = doc.get('front')
    if (front) {
      let frontEl = renderNodeComponent(this, $$, front, {
        disabled: this.props.disabled,
        configurator: configurator
      })
      el.append(frontEl)
    }

    // Render body
    let body = doc.get(this.props.bodyId)
    if (body) {
      let bodyEl = renderNodeComponent(this, $$, body, {
        disabled: this.props.disabled,
        configurator: configurator
      })
      el.append(bodyEl)
    }

    // Render back matter
    let back = doc.get('back')
    if (back) {
      let backEl = renderNodeComponent(this, $$, back, {
        disabled: this.props.disabled,
        configurator: configurator
      });
      el.append(backEl)
    }

    return el
  }

}

export default ArticleComponent
