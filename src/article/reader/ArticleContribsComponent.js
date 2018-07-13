import { Component } from 'substance'

export default class ArticleContribsComponent extends Component {
  render($$) {
    let model = this.props.model
    let contribs = model.getAuthors()
    let el = $$('div').addClass('sc-article-contribs')
    contribs.forEach((contrib, index) => {
      el.append(
        $$('span').addClass('se-contrib').html(
          model.renderContrib(contrib)
        )
      )
      if (index < contribs.length - 1) {
        el.append(', ')
      }
    })
    return el
  }
}