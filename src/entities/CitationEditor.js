import { Component, forEach } from 'substance'

const PUB_TYPES = [
  'journal-citation',
  'book-citation'
]

export default class CitationEditor extends Component {

  getInitialState() {
    // We want to keep state in a plain old JS object while editing
    let target = this._getTarget()
    return target.toJSON()
  }

  render($$) {
    let el = $$('div').addClass('sc-citation-editor')
    let schema = this._getSchema()

    // Render switcher
    let selectEl = $$('select')
      .ref('typeSwitcher')
      .on('change', this._switchType)
    PUB_TYPES.forEach((pubType) => {
      let optionEl = $$('option').attr('value', pubType).append(pubType)
      if (pubType === this.state.type) {
        optionEl.attr('selected', true)
      }
      selectEl.append(optionEl)
    })

    el.append(selectEl)

    forEach(schema, (property, propertyName) => {
      if (propertyName === 'id') {
        // id property is not editable
      } else if (property.type === 'string') {
        el.append(
          this._renderStringProperty(property.name, $$)
        )
      } else {
        console.log('type ', property.type, 'not yet supported')
      }
    })
    return el
  }

  _renderStringProperty(propertyName, $$) {
    return $$('div').append(
      $$('div').addClass('se-label').append(
        propertyName
      ),
      $$('input').attr({ type: 'text', value: this.state[propertyName] })
    )
  }

  // TODO: switch publication type
  _switchType() {
    this.extendState({
      type: this.refs.typeSwitcher.val()
    })
  }

  // Save changes!
  _update() {
  }

  _getTarget() {
    let doc = this.props.editorSession.getDocument()
    return doc.get(this.props.node.targetId)
  }

  _getSchema() {
    let schema = this.props.editorSession.getDocument().schema
    return schema.getNodeSchema(this.state.type)
  }
}
