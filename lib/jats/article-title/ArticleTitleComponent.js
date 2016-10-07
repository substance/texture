import TitleComponent from '../title/TitleComponent'

class ArticleTitleComponent extends TitleComponent {
  
  render(...args) {
    let el = super.render(...args)
    el.removeClass('sc-title')
    el.addClass('sc-article-title')
    return el
  }
}

export default ArticleTitleComponent
