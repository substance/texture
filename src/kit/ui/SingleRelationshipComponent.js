import ManyRelationshipComponent from './ManyRelationshipComponent'

export default class SingleRelationshipComponent extends ManyRelationshipComponent {
  _getClassNames () {
    return 'sc-single-relationship'
  }

  _getSelectedOptions (options) {
    let targetId = this._getValue()
    if (!targetId) return []
    let selectedOption = options.find(item => {
      if (item) return item.id === targetId
    })
    let selected = selectedOption ? [selectedOption] : []
    return selected
  }

  _toggleTarget (target) {
    if (this.context.editable) {
      let currentTargetId = this._getValue()
      let newTargetId
      if (currentTargetId === target.id) {
        newTargetId = undefined
      } else {
        newTargetId = target.id
      }
      this.context.api.setValue(this._getPath(), newTargetId)
    }
  }
}
