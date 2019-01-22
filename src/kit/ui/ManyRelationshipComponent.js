import { isArray } from 'substance'
import ValueComponent from './ValueComponent'
import MultiSelectInput from './MultiSelectInput'

export default class ManyRelationshipComponent extends ValueComponent {
  didMount () {
    // ATTENTION: relationships are unfortunately tricky regarding updates
    // obvious things are covered by the used helper, e.g., if the model is changed
    // or a one of the used targets has been removed
    // Other things are pretty much impossible to detect in a general way
    // e.g. the creation of a new target, or the deletion of an existing one
    // In this case the selection will be out of sync, and hopefully the implementation does react correctly
    // TODO: make sure that this is the case
    this.context.appState.addObserver(['document'], this._rerenderOnModelChangeIfNecessary, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const label = this.getLabel('select-item') + ' ' + this.props.label
    const options = this.getAvailableOptions()
    let selected = this._getSelectedOptions(options)
    let el = $$('div').addClass('sc-many-relationship')
    if (this.context.editable) {
      el.append(
        $$(MultiSelectInput, {
          label,
          selected,
          overlayId: this.props.model.id
        })
      )
    } else {
      const selectedLabels = []
      // ATTENTION: doing this with a for loop as it can happen
      // that an item is undefined (if id is not avaiable)
      for (let item of selected) {
        if (item) {
          selectedLabels.push(item.toString())
        }
      }
      let label = selectedLabels.join('; ')
      el.addClass('sm-readonly').append(label)
    }
    return el
  }

  getActionHandlers () {
    return {
      toggleOption: this._toggleTarget,
      toggleOverlay: this._toggleOverlay
    }
  }

  getAvailableOptions () {
    return this.props.model.getAvailableOptions()
  }

  _getSelectedOptions (options) {
    // pick all selected items from options this makes life easier for the MutliSelectComponent
    // because it does not need to map via ids, just can check equality
    let targetIds = this.props.model.getValue()
    let selected = targetIds.map(id => options.find(item => item.id === id)).filter(Boolean)
    return selected
  }

  _toggleTarget (target) {
    if (this.context.editable) {
      this.props.model.toggleTarget(target)
    }
  }

  _toggleOverlay () {
    const appState = this.context.appState
    let overlayId = appState.overlayId
    let modelId = this.props.model.id
    if (overlayId === modelId) {
      this.getParent().send('toggleOverlay')
    } else {
      // ATTENTION: At the moment a reducer maps value selections to appState.overlayId
      // i.e. we must not call toggleOverlay
      // But if we decided to disable the reducer this would break if
      // we used the common implementation.
      // TODO: rethink this approach in general
      this.context.api.selectValue(this._getPath())
      appState.set('overlayId', modelId, 'propagateImmediately')
    }
  }

  _rerenderOnModelChangeIfNecessary (change) {
    let updateNeeded = Boolean(change.updated[this._getPath()])
    if (!updateNeeded) {
      let ids = this.props.model.getValue()
      if (ids) {
        if (!isArray(ids)) {
          ids = [ids]
        }
        for (let id of ids) {
          if (change.deleted[id] || change.updated[id]) {
            updateNeeded = true
            break
          }
        }
      }
    }
    if (updateNeeded) {
      this._rerenderOnModelChange()
    }
  }

  _rerenderOnModelChange () {
    // console.log('Rerendering RelationshipComponent because model has changed', this._getPath())
    this.rerender()
  }
}
