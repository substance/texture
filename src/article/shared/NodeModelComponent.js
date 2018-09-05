import { FontAwesomeIcon, Component } from 'substance'
import { FormRowComponent } from '../../kit'

export default class NodeModelComponent extends Component {
  didMount () {
    // EXPERIMENTAL: ExperimentalArticleValidator updates `node.id, @issues`
    const model = this.props.model
    this.context.appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: {
        path: [model.id, '@issues']
      }
    })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  getInitialState () {
    return {
      fullMode: false
    }
  }

  render ($$) {
    const fullMode = this.state.fullMode
    const model = this.props.model
    // TODO: issues should be accessed via model, not directly
    const nodeIssues = model._node['@issues']
    let hasIssues = (nodeIssues && nodeIssues.size > 0)

    const el = $$('div').addClass(this._getClassNames())

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
        let label
        if (this._showLabelForProperty(property.name)) {
          label = this.getLabel(property.name)
        }
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
      const Button = this.getComponent('button')
      footer.append(
        $$(Button).addClass('se-remove-item').append(
          $$(FontAwesomeIcon, { icon: 'fa-trash' }).addClass('se-icon'),
          this.getLabel('remove')
        ).on('click', this._removeEntity)
      )
    }

    el.append(footer)

    return el
  }

  _getClassNames () {
    return `sc-node-model sm-${this.props.model.type}`
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

  /*
    Can be overriden to specify for which properties, labels should be hidden.
  */
  _showLabelForProperty (prop) {
    return true
  }

  get isRemovable () {
    return true
  }

  _getPropertyEditorClass (property) {
    return this.getComponent(property.type)
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
