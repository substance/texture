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

    const properties = this._getProperties()
    const propNames = Array.from(properties.keys())
    // all required and non-empty properties are always displayed
    let visiblePropNames = fullMode ? propNames : this._getRequiredOrNonEmptyPropertyNames(properties)
    // show only the first k items
    if (visiblePropNames.length === 0) {
      visiblePropNames = propNames.slice(0, CARD_MINIMUM_FIELDS)
    }
    let hasHiddenProps = visiblePropNames.length < propNames.length

    for (let name of visiblePropNames) {
      let value = properties.get(name)
      el.append(
        this._renderProperty($$, name, value, nodeIssues)
      )
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

  _renderProperty ($$, name, value, nodeIssues) {
    const PropertyEditor = this._getPropertyEditorClass(name, value)
    const editorProps = this._getPropertyEditorProps(name, value)
    // skip this property if the editor implementation produces nil
    if (PropertyEditor) {
      const issues = nodeIssues ? nodeIssues.get(name) : []
      return $$(FormRowComponent, {
        label: editorProps.label,
        issues
      }).addClass(`sm-${name}`).append(
        $$(PropertyEditor, editorProps).ref(name)
      )
    }
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

  _getPropertyEditorProps (name, value) {
    let props = {
      // TODO: rename to value
      model: value,
      placeholder: this._getPlaceHolder(name)
    }
    if (this._showLabelForProperty(name)) {
      props.label = this.getLabel(name)
    }
    // TODO: is this really what we want? i.e. every CHILDREN value
    // is rendered as a container?
    if (value.type === 'collection') {
      props.container = true
    }
    return props
  }

  _getPlaceHolder (name) {
    // ATTENTION: usually we avoid using automatically derived labels
    // but this class is all about a automated rendereding
    let placeHolder
    // first try to get the canonical label
    const canonicalLabel = `${name}-placeholder`
    placeHolder = this.getLabel(canonicalLabel)
    // next try to get a label using a template 'Enter ${something}'
    if (placeHolder === canonicalLabel) {
      let nameLabel = this.getLabel(name)
      if (nameLabel) {
        placeHolder = this.getLabel('enter-something', { something: nameLabel })
      } else {
        console.warn(`Please define a label for key "${name}"`)
      }
    }
    return placeHolder
  }

  _getRequiredOrNonEmptyPropertyNames (properties) {
    const api = this.context.api
    let result = new Set()
    for (let [name, value] of properties) {
      if (!value.isEmpty() || api._isFieldRequired(value._getPropertySelector())) {
        result.add(name)
      }
    }
    return Array.from(result)
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
