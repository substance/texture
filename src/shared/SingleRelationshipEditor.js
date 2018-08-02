import { Component } from 'substance'
import SelectInput from './SelectInput'

export default class SingleRelationshipEditor extends Component {
  render ($$) {
    const model = this.props.model
    const value = model.getTarget()
    const options = model.getAvailableTargets()
    return $$(SelectInput, {
      value,
      options
    })
  }
}
