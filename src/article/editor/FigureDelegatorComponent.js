import { Component } from 'substance'
import FigComponent from './FigComponent'
import FigureOptionComponent from './FigureOptionComponent'

export default class FigureDelegatorComponent extends Component {
  render ($$) {
    if (this.props.mode === 'option') {
      return $$(FigureOptionComponent, this.props)
    } else {
      return $$(FigComponent, this.props)
    }
  }
}
