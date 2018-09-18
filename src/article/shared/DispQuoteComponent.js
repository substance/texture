import { Component } from 'substance'

export default class DispQuoteComponent extends Component {
  render ($$) {
    let model = this.props.model
    const contentValueModel = model.getPropertyValue('content')
    const attribValueModel = model.getPropertyValue('attrib')
    const ContentEditor = this.getComponent(contentValueModel.type)
    const AttribEditor = this.getComponent(attribValueModel.type)

    let el = $$('div')
      .addClass('sc-disp-quote')
      .attr('data-id', model.id)

    el.append(
      $$(ContentEditor, {
        model: contentValueModel,
        placeholder: 'Enter attribution'
      })
    )

    el.append(
      $$(AttribEditor, {
        model: attribValueModel,
        placeholder: 'Enter attribution'
      })
    )
    return el
  }
}
