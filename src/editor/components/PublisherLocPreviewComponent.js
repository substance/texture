import { Component } from 'substance'

export default class PublisherLocPreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let publisherLoc = node.find('publisher-loc').text()

    let el = $$('span').addClass('sc-publisher-loc-preview')

    if(publisherLoc) {
      el.append(publisherLoc)
    } else {
      el.addClass('sm-placeholder').append('Publisher’s Location')
    }

    return el
  }
}
