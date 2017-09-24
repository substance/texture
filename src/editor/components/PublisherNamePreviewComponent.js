import { Component } from 'substance'

export default class PublisherNamePreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let publisherName = node.find('publisher-name').text()

    let el = $$('span').addClass('sc-publisher-name-preview')

    if(publisherName) {
      el.append(publisherName)
    } else {
      el.addClass('sm-placeholder').append('Publisher’s Name')
    }

    return el
  }
}
