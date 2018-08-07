import { Component } from 'substance'

export default class AbstractComponent extends Component {
  getInitialState () {
    const model = this.props.model
    const items = model.getItems()
    // by default we hide empty abstracts
    // TODO: this should be configurable
    let isEmpty = items.length === 1 && items[0].getContent().isEmpty()
    return {
      hidden: isEmpty
    }
  }

  render ($$) {
    const model = this.props.model
    const ModelComponent = this.getComponent(model.type)
    let el = $$('div')
      .addClass('sc-abstract')
      .attr('data-id', model.id)

    if (!this.state.hidden) {
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
    } else {
      el.addClass('sm-hidden')
    }
    return el
  }
}
