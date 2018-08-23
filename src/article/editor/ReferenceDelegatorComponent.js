import { Component } from 'substance'
import ReferenceComponent from '../shared/ReferenceComponent'
import ReferenceOptionComponent from './ReferenceOptionComponent'

export default class ReferenceDelegatorComponent extends Component {
  render ($$) {
    if (this.props.mode === 'option') {
      return $$(ReferenceOptionComponent, this.props)
    } else {
      return $$(ReferenceComponent, this.props)
    }
  }
}
