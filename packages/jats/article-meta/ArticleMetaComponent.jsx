import Component from 'substance/ui/Component'
import renderNodeComponent from '../../../util/renderNodeComponent'

class ArticleMetaComponent extends Component {

  render($$) {
    var node = this.props.node
    var doc = node.getDocument()

    var childrenEls = node.nodes.map(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (childNode.type !== 'unsupported') {
        return renderNodeComponent(this, $$, childNode, {
          disabled: this.props.disabled
        })
      }
    }.bind(this))

    return (
      <div class="sc-article-meta" data-id="{this.props.node.id}">
        { childrenEls }
      </div>
    )
  }

}

export default ArticleMetaComponent
