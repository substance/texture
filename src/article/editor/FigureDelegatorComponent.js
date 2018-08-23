import { Component } from 'substance'
import FigureComponent from '../shared/FigureComponent'
import FigureOptionComponent from './FigureOptionComponent'

export default class FigureDelegatorComponent extends Component {
  render ($$) {
    if (this.props.mode === 'option') {
      return $$(FigureOptionComponent, this.props)
    } else {
      return $$(FigureComponent, this.props)
    }
  }
}
