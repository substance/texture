import { Component } from 'substance'

export default class VolumePreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let volume = node.find('volume').text()

    let el = $$('span').addClass('sc-volume-preview')

    if(volume) {
      el.append(volume)
    } else {
      el.addClass('sm-placeholer').append('Volume')
    }

    return el
  }
}
