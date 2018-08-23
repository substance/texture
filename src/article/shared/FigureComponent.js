import { Component } from 'substance'
import renderModelComponent from './renderModelComponent'

export default class FigureComponent extends Component {
  render ($$) {
    const model = this.props.model
    let el = $$('div')
      .addClass('sc-' + model.type)
      .attr('data-id', model.id)

    // CHALLENGE: this should be rendered as readonly
    // Furthermore, ATM we use the node.state to store generated labels
    // as they are volatile. Thus, this component should observe changes to the node state and rerender on change.
    let label = model.getLabel()
    let labelEl = $$('div').addClass('se-label').text(label)
    el.append(labelEl)

    el.append(
      renderModelComponent(this.context, $$, {
        model: model.getContent()
      }).ref('content').addClass('se-content')
    )

    el.append(
      renderModelComponent(this.context, $$, {
        model: model.getTitle(),
        label: 'Title'
      }).ref('title').addClass('se-title')
    )

    el.append(
      renderModelComponent(this.context, $$, {
        model: model.getCaption(),
        label: 'Caption'
      }).ref('caption').addClass('se-caption')
    )

    return el
  }
}
