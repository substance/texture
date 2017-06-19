import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class MetadataSection extends Component {

  render($$) {
    let el = $$('div').addClass('sc-metadata-section')

    let iconName = this.props.expanded ? 'fa-angle-down' : 'fa-angle-right'
    el.append(
      $$('div').addClass('se-label').append(
        this.props.label
      )
    )
    el.append(
      $$('div').addClass('se-expanded').append(
        $$(Icon, { icon: iconName })
      )
    )
    return el
  }
}