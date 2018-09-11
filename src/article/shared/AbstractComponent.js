import { Component } from 'substance'

export default class AbstractComponent extends Component {
  render ($$) {
    const model = this.props.model
    const ModelComponent = this.getComponent(model.type)
    let el = $$('div')
      .addClass('sc-abstract')
      .attr('data-id', model.id)

    el.append(
      // TODO use label provider
      $$('h1').addClass('sc-heading').append('Abstract')
    )
    el.append(
      $$(ModelComponent, {
        model: model,
        placeholder: 'Enter Abstract',
        name: 'abstractEditor'
      })
    )
    return el
  }
}
