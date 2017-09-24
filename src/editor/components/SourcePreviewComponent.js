import { Component } from 'substance'

export default class SourcePreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let source = node.find('source').text()

    let el = $$('span').addClass('sc-source-preview')

    if(source) {
      el.append(source)
    } else {
      el.addClass('sm-placeholder').append('Source')
    }

    return el
  }
}
