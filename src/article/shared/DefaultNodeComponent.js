import { FontAwesomeIcon, Component } from 'substance'
import { FormRowComponent, createNodePropertyModels } from '../../kit'
import { CARD_MINIMUM_FIELDS } from '../ArticleConstants'

/**
 * A component that renders a node in a generic way iterating all properties.
 */
export default class DefaultNodeComponent extends Component {
  didMount () {
    // EXPERIMENTAL: ExperimentalArticleValidator updates `node.id, @issues`
    const node = this._getNode()
    this.context.appState.addObserver(['document'], this._rerenderWhenIssueHaveChanged, this, {
      stage: 'render',
      document: {
        path: [node.id, '@issues']
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
    const node = this._getNode()
    // TODO: issues should be accessed via model, not directly
    const nodeIssues = node['@issues']
    let hasIssues = (nodeIssues && nodeIssues.size > 0)
    const el = $$('div').addClass(this._getClassNames()).attr('data-id', node.id)
    // EXPERIMENTAL: highlighting fields with issues
    if (hasIssues) {
      el.addClass('sm-warning')
    }
    el.append(this._renderHeader($$))

    // TODO: this needs to be redesigned:
    // 1. it should be configurable which properties are optional
    // 2. the determination of hidden vs shown props should be extracted into a helper method
    let hasHiddenProps = false
    const properties = this._getProperties()
    const propsLength = properties.size
    const hiddenPropsLength = Array.from(properties.keys()).reduce((total, key) => {
      let property = properties.get(key)
      // FIXME: hide properties that are not required
      if (property.isEmpty()) {
        total++
      }
      return total
    }, 0)
    const exposedPropsLength = propsLength - hiddenPropsLength
    let fieldsLeft = CARD_MINIMUM_FIELDS - exposedPropsLength

    for (let [name, value] of properties) {
      // FIXME: hide properties that are not required
      let hidden = value.isEmpty()
      if (hidden && fieldsLeft > 0) {
        hidden = false
        fieldsLeft--
      }
      if (hidden) hasHiddenProps = true
      if (fullMode || !hidden) {
        const PropertyEditor = this._getPropertyEditorClass(name, value)
        // skip this property if the editor implementation produces nil
        if (!PropertyEditor) continue
        let label
        if (this._showLabelForProperty(name)) {
          label = this.getLabel(name)
        }
        const issues = nodeIssues ? nodeIssues.get(name) : []
        el.append(
          $$(FormRowComponent, {
            label,
            issues
          }).addClass(`sm-${name}`).append(
            $$(PropertyEditor, {
              label,
              // TODO: rename to value
              model: value
            }).ref(name)
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

    el.append(footer)

    return el
  }

  _getNode () {
    return this.props.node
  }

  _getProperties () {
    if (!this._properties) {
      this._properties = this._createPropertyModels()
    }
    return this._properties
  }

  _createPropertyModels () {
    return createNodePropertyModels(this.context.api, this._getNode())
  }

  _getClassNames () {
    return `sc-default-model sm-${this._getNode().type}`
  }

  _renderHeader ($$) {
    // TODO: rethink this. IMO it is not possible to generalize this implementation.
    // Maybe it is better to just use the regular component and pass a prop to allow the component to render in a 'short' style
    const ModelPreviewComponent = this.getComponent('model-preview', true)
    const node = this._getNode()
    let header = $$('div').addClass('se-header')
    if (ModelPreviewComponent) {
      header.append(
        $$(ModelPreviewComponent, { node })
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

  // TODO: get rid of this
  get isRemovable () {
    return true
  }

  _getPropertyEditorClass (name, value) {
    return this.getComponent(value.type)
  }

  _toggleMode () {
    const fullMode = this.state.fullMode
    this.extendState({fullMode: !fullMode})
  }

  _rerenderWhenIssueHaveChanged () {
    // console.log('Rerendering NodeModelCompent after issues have changed', this._getNode().id)
    this.rerender()
  }
}
