import { NodeComponent } from '../../kit'

export default class AbstractComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-abstract')
    el.append(
      this._renderValue($$, 'content', {
        placeholder: this.getLabel('abstract-placeholder')
      })
      // ATTENTION: without having this ref the surface gets created and disposed on each change which is bad
      // Generally every Surface should have a ref
      // But beyond that, it reveals a problem with the RenderingEngine, probably related to 'Forwarding Components'
      // leaving this comment here as a reminder and an entry point for me
      // TODO: fix RenderingEngine bug
        .ref('content')
    )
    return el
  }
}
