import { Component, TextPropertyComponent } from 'substance'

export default class ElementCitationTitle extends Component {

  render($$) {
    let el = $$(this.props.tagName || 'div').addClass('sc-element-citation-title')
    let node = this.props.node
    let title = node.find('article-title') || node.find('chapter-title')

    if (title && title.content) {
      el.append(
        $$(TextPropertyComponent, {
          path: title.getPath()
        }).ref(title.id)
      )
    } else {
      el.append('No title available')
    }
    return el
  }
}
