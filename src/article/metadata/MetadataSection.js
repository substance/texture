import { ModelComponent } from '../../kit'
import CardComponent from '../shared/CardComponent'

export default class MetadataSection extends ModelComponent {
  render ($$) {
    const model = this.props.model
    const label = this.getLabel(model.id)
    const isCollection = model.isCollection

    let el = $$('div').addClass('sc-metadata-section')
    let ModelEditor = this.getComponent(model.type, true)
    if (!ModelEditor) ModelEditor = isCollection ? this.getComponent('collection') : this.getComponent('entity')
    let modelEl = $$(ModelEditor, { model }).ref('editor')
    // non-collection models are wrapped in a Card
    if (isCollection) {
      const items = model.getItems()
      if (items.length > 0) {
        el.append(
          $$('div').addClass('se-heading').append(
            $$('div').addClass('se-header').append(label)
          ),
          modelEl
        )
      }
    } else {
      el.append(
        $$('div').addClass('se-heading').append(
          $$('div').addClass('se-header').append(label)
        ),
        $$(CardComponent).append(modelEl)
      )
    }
    return el
  }
}
