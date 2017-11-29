import { Component } from 'substance'
// TODO: discuss if we can generalize this
import entityRenderers from '../../entities/entityRenderers'

export default class EntityPreviewComponent extends Component {

  render($$) {
    const node = this.props.node
    let renderEntity = entityRenderers[node.type]
    let el = $$('div')
      .addClass('sc-entity-preview')
      .addClass('sm-'+node.type)
    if (this.props.selected) {
      el.addClass('sm-selected')
    }
    if (renderEntity) {
      el.html(
        renderEntity(node.id, node.getDocument())
      )
    }
    return el
  }

}