import NodeComponent from '../shared/NodeComponent'

// TODO: dead code?
export default class RefComponent extends NodeComponent {
  render ($$) {
    const api = this.context.api
    const ref = this.props.node
    let label = _getReferenceLabel(ref)
    let entityHtml = api._renderEntity(ref)

    // TODO: do we want to display something like this
    // if so, use the label provider
    entityHtml = entityHtml || '<i>Not available</i>'

    return $$('div').addClass('sc-ref-component').append(
      $$('div').addClass('se-label').append(label),
      $$('div').addClass('se-text').html(entityHtml)
    ).attr('data-id', ref.id)
  }
}

function _getReferenceLabel (ref) {
  if (ref.state && ref.state.label) {
    return ref.state.label
  }
  return '?'
}
