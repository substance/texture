import { Component } from 'substance'

export default class FpagePreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let fpage = node.find('fpage').text()

    let el = $$('span').addClass('sc-fpage-preview')

    if(fpage) {
      el.append(fpage)
    } else {
      el.addClass('sm-placeholder').append('First Page')
    }

    return el
  }
}
