import { Component } from 'substance'
import renderModelComponent from './renderModelComponent'

export default class FigureComponent extends Component {
  render ($$) {
    let model = this.props.model
    let el = $$('div').addClass('sc-figure')
    let panels = model.getPanels()
    el.append(panels.map(panel => renderModelComponent(this.context, $$, {
      model: panel
    })))
    return el
  }
}
