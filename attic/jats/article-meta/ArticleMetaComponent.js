import { Component } from 'substance'
import renderNodeComponent from '../../util/renderNodeComponent'

class ArticleMetaComponent extends Component {
  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-article-meta')
      .attr('data-id', this.props.node.id)

    let children = node.nodes
    children.forEach(function(nodeId) {
      let childNode = doc.get(nodeId)
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      }
    }.bind(this))
    return el
  }
}

export default ArticleMetaComponent
