import { Component } from 'substance'
import CardComponent from '../shared/CardComponent'

export default class MetadataSection extends Component {
  render ($$) {
    const model = this.props.model
    const label = this.getLabel(model.type)
    // TODO: find a better way to differentiate collections
    const isCollection = typeof model.getItems === 'function'
    let el = $$('div').addClass('sc-metadata-section')
    el.append(
      $$('div').addClass('se-heading').append(
        $$('div').addClass('se-header').append(label)
      )
    )
    let ModelEditor = this.getComponent(model.type, true)
    if (!ModelEditor) ModelEditor = isCollection ? this.getComponent('collection') : this.getComponent('entity')
    let modelEl = $$(ModelEditor, { model }).ref('editor')
    // non-collection models are wrapped in a Card
    if (isCollection) {
      el.append(modelEl)
    } else {
      el.append($$(CardComponent).append(modelEl))
    }
    return el
  }
}
