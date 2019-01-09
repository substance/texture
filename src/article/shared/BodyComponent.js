import { NodeComponent } from '../../kit'

export default class BodyComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-body')
    el.append(
      this._renderValue($$, 'content', { container: true })
    )
    return el
  }
}
