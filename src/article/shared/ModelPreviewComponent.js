import { ModelComponent } from '../../kit'

export default class ModelPreviewComponent extends ModelComponent {
  render ($$) {
    // TODO: rethink this. IMO rendering should not be part of the Article API
    // Either it could be part of the general Model API, i.e. model.previewHtml()
    // or we could use some kind of configurable renderer, very much like a converter
    let model = this.props.model
    let api = this.context.api
    let el = $$('div').addClass('sc-model-preview')
    el.html(
      api.renderEntity(model)
    )
    return el
  }
}
