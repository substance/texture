import ManyRelationshipEditor from './ManyRelationshipEditor'

export default class SingleRelationshipEditor extends ManyRelationshipEditor {
  _getSelectedOptions (options) {
    let targetId = this.props.model.getValue()
    let selectedOption = options.find(item => item.id === targetId)
    let selected = selectedOption ? [selectedOption] : []
    return selected
  }
}
