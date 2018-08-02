import { FontAwesomeIcon, CustomSurface } from 'substance'
import FormRowComponent from './FormRowComponent'

export default class NodeModelEditor extends CustomSurface {
  getInitialState () {
    return {
      fullMode: false
    }
  }

  render ($$) {
    // FIXME: bring back validation
    const fullMode = this.state.fullMode
    const model = this.props.model
    const ModelPreviewComponent = this.getComponent('model-preview')

    const el = $$('div').addClass('sc-entity-editor')
      .addClass(`sm-${model.type}`)

    let header = $$('div').addClass('se-header')
    if (ModelPreviewComponent) {
      header.append(
        $$(ModelPreviewComponent, { model })
      )
    }
    el.append(header)

    let hasHiddenProps = false
    const properties = model.getProperties()
    for (let property of properties) {
      let hidden = !property.isRequired() && property.isEmpty()
      if (hidden) hasHiddenProps = true
      if (fullMode || !hidden) {
        const PropertyEditor = this.getComponent(property.type)
        const label = this.getLabel(property.name)
        const model = property.model
        el.append(
          $$(FormRowComponent, {
            label
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

    el.append(
      $$('div').addClass('se-footer').append(
        controlEl,
        $$('button').addClass('se-remove-item').append(
          $$(FontAwesomeIcon, { icon: 'fa-trash' }).addClass('se-icon'),
          'Remove'
        ).on('click', this._removeEntity)
      )
    )

    return el
  }

  _getCustomResourceId () {
    return this.props.model.id
  }

  rerenderDOMSelection (...args) {
    console.log('EntityEditor.rerenderDOMSelection()', args)
  }

  _toggleMode () {
    const fullMode = this.state.fullMode
    this.extendState({fullMode: !fullMode})
  }

  _removeEntity () {
    const model = this.props.model
    this.send('remove-item', model)
  }
}
