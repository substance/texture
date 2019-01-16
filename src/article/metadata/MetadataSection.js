import { ModelComponent } from '../../kit'
// import CardComponent from '../shared/CardComponent'
import MetadataCollectionComponent from './MetadataCollectionComponent'

export default class MetadataSection extends ModelComponent {
  render ($$) {
    const model = this.props.model
    const name = this.props.name
    // const label = this.getLabel(model.id)
    let el = $$('div').addClass('sc-metadata-section').addClass(`sm-${name}`)
    if (model.type === 'collection') {
      let label = this.getLabel(name)
      el.append(
        $$('div').addClass('se-heading').attr('id', model.id).append(
          $$('div').addClass('se-header').append(label)
        )
      )
      el.append(
        $$(MetadataCollectionComponent, { model }).ref('collection')
      )
      if (model.length === 0) {
        el.addClass('sm-empty')
      }
    } else {
      let CustomEditor = this.getComponent(model.id)
      let label = this.getLabel(name)
      el.append(
        $$('div').addClass('se-heading').attr('id', model.id).append(
          $$('div').addClass('se-header').append(label)
        )
      )
      el.append(
        $$(CustomEditor, { model }).ref('editor')
      )
    }
    return el
  }
}
