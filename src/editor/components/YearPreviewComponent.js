import { Component } from 'substance'

export default class YearPreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let year = node.find('year').text()

    let el = $$('span').addClass('sc-year-preview')

    if(year) {
      el.append(year)
    } else {
      el.addClass('sm-placeholder').append('Year')
    }

    return el
  }
}
