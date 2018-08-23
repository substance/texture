import ManyRelationshipComponent from './ManyRelationshipComponent'

export default class SingleRelationshipComponent extends ManyRelationshipComponent {
  _getSelectedOptions (options) {
    let targetId = this.props.model.getValue()
    let selectedOption = options.find(item => item.id === targetId)
    let selected = selectedOption ? [selectedOption] : []
    return selected
  }
}
