import { Component } from 'substance'

export default class LpagePreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let lpage = node.find('lpage').text()

    let el = $$('span').addClass('sc-lpage-preview')

    if(lpage) {
      el.append(lpage)
    } else {
      el.addClass('sm-placeholer').append('Last Page')
    }

    return el
  }
}
