import { Component } from 'substance'

export default class TitleComponent extends Component {
  render ($$) {
    const model = this.props.model
    const ModelComponent = this.getComponent(model.type)
    const SectionLabel = this.getComponent('section-label')
    let el = $$('div')
      .addClass('sc-title')
      .attr('data-id', model.id)

    el.append(
      $$(SectionLabel, {label: 'title-label'}),
      $$(ModelComponent, {
        model: model,
        placeholder: this.getLabel('title-placeholder'),
        name: 'titleEditor'
      })
    )
    return el
  }
}
