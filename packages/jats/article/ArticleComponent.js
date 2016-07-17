import Component from 'substance/ui/Component'
import renderNodeComponent from '../../../util/renderNodeComponent'

class ArticleComponent extends Component {

  render($$) {
    var node = this.props.node
    var doc = node.getDocument()
    var configurator = this.props.configurator

    var frontEl = renderNodeComponent(this, $$, doc.get('front'), {
      disabled: this.props.disabled,
      configurator: configurator
    })

    var bodyEl = renderNodeComponent(this, $$, doc.get(this.props.bodyId), {
      disabled: this.props.disabled,
      configurator: configurator
    })

    var backEl = renderNodeComponent(this, $$, doc.get('back'), {
      disabled: this.props.disabled,
      configurator: configurator
    })

    return (
      <div class="sc-article" data-id="{this.props.node.id}">
        { frontEl }
        { bodyEl }
        { backEl }
      </div>
    )
  }
}

export default ArticleComponent;