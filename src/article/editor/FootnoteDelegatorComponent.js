import { Component } from 'substance'
import FootnoteComponent from '../shared/FootnoteComponent'
import FootnoteOptionComponent from './FootnoteOptionComponent'

export default class FootnoteDelegatorComponent extends Component {
  render ($$) {
    if (this.props.mode === 'option') {
      return $$(FootnoteOptionComponent, this.props)
    } else {
      return $$(FootnoteComponent, this.props)
    }
  }
}
