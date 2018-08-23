import { FontAwesomeIcon, CustomSurface } from 'substance'
import FormRowComponent from '../ui/FormRowComponent'

/*
  TODO: is this used anymore?
*/
export default class NodeModelComponent extends CustomSurface {
  getInitialState () {
    return {
      fullMode: false
    }
  }

  render ($$) {
    // FIXME: bring back validation
    const fullMode = this.state.fullMode
    const model = this.props.model

    // TODO: issues should be accessed via model, not directly
    const nodeIssues = model._node['@issues']
    let hasIssues = (nodeIssues && nodeIssues.size > 0)

    const el = $$('div').addClass('sc-entity-editor')
      .addClass(`sm-${model.type}`)

    // EXPERIMENTAL: highlight editors for nodes with issues
    if (hasIssues) {
      el.addClass('sm-warning')
    }

    el.append(this._renderHeader($$))

    let hasHiddenProps = false
    const properties = model.getProperties()
    for (let property of properties) {
      let hidden = !property.isRequired() && property.isEmpty()
      if (hidden) hasHiddenProps = true
      if (fullMode || !hidden) {
        const PropertyEditor = this._getPropertyEditorClass(property)
        // skip this property if the editor implementation produces nil
        if (!PropertyEditor) continue

        const label = this.getLabel(property.name)
        const model = property.model
        const issues = nodeIssues ? nodeIssues.get(property.name) : []
        el.append(
          $$(FormRowComponent, {
            label,
            issues
          }).append(
            $$(PropertyEditor, {
              label,
              model
            }).ref(property.name)
          )
        )
      }
    }

    const controlEl = $$('div').addClass('se-control')
      .on('click', this._toggleMode)

    if (hasHiddenProps) {
      if (fullMode) {
        controlEl.append(
          $$(FontAwesomeIcon, { icon: 'fa-chevron-up' }).addClass('se-icon'),
          this.getLabel('show-less-fields')
        )
      } else {
        controlEl.append(
          $$(FontAwesomeIcon, { icon: 'fa-chevron-down' }).addClass('se-icon'),
          this.getLabel('show-more-fields')
        )
      }
    }

    const footer = $$('div').addClass('se-footer').append(
      controlEl
    )

    if (this.isRemovable) {
      footer.append(
        $$('button').addClass('se-remove-item').append(
          $$(FontAwesomeIcon, { icon: 'fa-trash' }).addClass('se-icon'),
          'Remove'
        ).on('click', this._removeEntity)
      )
    }

    el.append(footer)

    return el
  }

  _renderHeader ($$) {
    // TODO: rethink this. IMO it is not possible to generalize this implementation.
    // Maybe it is better to just use the regular component and pass a prop to allow the component to render in a 'short' style
    const ModelPreviewComponent = this.getComponent('model-preview', true)
    const model = this.props.model
    let header = $$('div').addClass('se-header')
    if (ModelPreviewComponent) {
      header.append(
        $$(ModelPreviewComponent, { model })
      )
    }
    return header
  }

  get isRemovable () {
    return true
  }

  _getPropertyEditorClass (property) {
    return this.getComponent(property.type)
  }

  _getCustomResourceId () {
    return this.props.model.id
  }

  // rerenderDOMSelection (...args) {
  //   console.log('NodeModelComponent.rerenderDOMSelection()', args)
  // }

  _toggleMode () {
    const fullMode = this.state.fullMode
    this.extendState({fullMode: !fullMode})
  }

  _removeEntity () {
    const model = this.props.model
    this.send('remove-item', model)
  }
}
