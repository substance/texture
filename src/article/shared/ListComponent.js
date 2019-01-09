import { isString, renderListNode } from 'substance'
import { NodeComponent } from '../../kit'

export default class ListComponent extends NodeComponent {
  render ($$) {
    const ListItemComponent = this.getComponent('list-item')
    let node = this.props.node
    // TODO: is it ok to rely on Node API here?
    let el = renderListNode(node, item => {
      // item is either a list item node, or a tagName
      if (isString(item)) {
        return $$(item)
      } else if (item.type === 'list-item') {
        return $$(ListItemComponent, {
          node: item
        }).ref(item.id)
      }
    })
    el.addClass('sc-list').attr('data-id', node.id)
    return el
  }

  // we need this ATM to prevent this being wrapped into an isolated node (see ContainerEditor._renderNode())
  get _isCustomNodeComponent () { return true }
}
