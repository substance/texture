import ManyRelationshipComponent from './ManyRelationshipComponent'

export default class SingleRelationshipComponent extends ManyRelationshipComponent {
  _getSelectedOptions (options) {
    let targetId = this.props.model.getValue()
    if (!targetId) return []
    let selectedOption = options.find(item => {
      if (item) return item.id === targetId
    })
    let selected = selectedOption ? [selectedOption] : []
    return selected
  }
}
