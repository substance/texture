import { NodeComponent } from '../../kit'

export default class AcknowledgementComponent extends NodeComponent {
  render ($$) {
    let el = $$('div').addClass('sc-acknowledgement')
    el.append(
      this._renderValue($$, 'content', {
        placeholder: this.getLabel('acknowledgement-placeholder')
      })
    )
    return el
  }
}
