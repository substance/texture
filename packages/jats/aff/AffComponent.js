import { Component, FontAwesomeIcon as Icon } from 'substance'
import { getAdapter } from './affUtils'

class AffComponent extends Component {
  constructor(...args) {
    super(...args)
  }

  render($$) {
    var aff = getAdapter(this.props.node);
    var el = $$('div').addClass('sc-aff')
      .append($$(Icon, {icon: 'fa-building-o'}))
      .append(' '+aff.name)
    return el;
  }
}

export default AffComponent
