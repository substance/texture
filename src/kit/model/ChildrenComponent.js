import ValueComponent from './ValueComponent'

export default class ChildrenModelComponent extends ValueComponent {
  render ($$) {
    let el = $$('div').addClass('sc-children')
    if (!this.context.editable) {
      el.addClass('sm-readonly')
    }
    el.append(
      this._renderChildren($$)
    )
    return el
  }

  _renderChildren ($$) {
    // TODO: we need a good UX pattern for canonically created editors
    // for hierarchical nodes
    // For example, 'ref-contrib' nodes are not used using
    // a general N-to-M-relationship but as parent-child relationship.
    // I.e. a ref-contrib should only be used by one 'reference' node
    const model = this.props.model
    let children = model.getChildren()
    return children.map(child => {
      return $$('div').addClass('se-child').html(
        this.context.api.renderEntity(child)
      )
    })
  }
}
