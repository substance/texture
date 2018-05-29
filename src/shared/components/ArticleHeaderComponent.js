import { Component } from 'substance'

export default class ArticleHeaderComponent extends Component {

  render($$) {
    let ArticleTitleComponent = this.getComponent('article-title')
    let ArticleContribsComponent = this.getComponent('article-contribs')

    let el = $$('div')
      .addClass('sc-article-header').append(
        $$(ArticleTitleComponent, {
          model: this.props.title,
          disabled: this.props.disabled
        }),
        $$(ArticleContribsComponent, {
          model: this.props.contribs,
          disabled: this.props.disabled
        })
      )
    return el
  }
}
