import { Component } from 'substance'

export default class BodyComponent extends Component {
  render ($$) {
    const model = this.props.model
    const ModelComponent = this.getComponent(model.type)
    const SectionLabel = this.getComponent('section-label')
    let el = $$('div')
      .addClass('sc-body')
      .attr('data-id', model.id)

    el.append(
      $$(SectionLabel, {label: 'body-label'}),
      $$(ModelComponent, {
        model: model,
        placeholder: this.getLabel('body-placeholder'),
        label: 'body'
      }).addClass('sm-body')
    )
    return el
  }
}
