import { Component } from 'substance'

export default class EditionPreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let edition = node.find('edition').text()

    let el = $$('span').addClass('sc-edition-preview')

    if(edition) {
      el.append(edition)
    } else {
      el.addClass('sm-placeholer').append('Edition')
    }

    return el
  }
}
