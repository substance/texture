import { Component } from 'substance'

export default class ArticleTitlePreviewComponent extends Component {
  render($$) {
    let node = this.props.node
    let articleTitle = node.find('article-title').text()

    let el = $$('span').addClass('sc-articel-title-preview')

    if(articleTitle) {
      el.append(articleTitle)
    } else {
      el.addClass('sm-placeholer').append('Article Title')
    }

    return el
  }
}
