import { Component } from 'substance'

export default class AbstractComponent extends Component {
  render ($$) {
    const model = this.props.model
    const ModelComponent = this.getComponent(model.type)
    const SectionLabel = this.getComponent('section-label')
    let el = $$('div')
      .addClass('sc-abstract')
      .attr('data-id', model.id)

    el.append(
      $$(SectionLabel, {label: 'abstract-label'}),
      $$(ModelComponent, {
        model: model,
        placeholder: this.getLabel('abstract-placeholder'),
        name: 'abstractEditor'
      })
    )
    return el
  }
}
