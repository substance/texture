import { $$ } from 'substance'
import { NodeComponent } from '../../kit'

export default class AbstractComponent extends NodeComponent {
  render () {
    let el = $$('div').addClass('sc-abstract')
    el.append(
      this._renderValue('content', {
        placeholder: this.getLabel('abstract-placeholder')
      })
    )
    return el
  }
}
