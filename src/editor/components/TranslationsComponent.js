import { NodeComponent } from 'substance'

/*
  Edit translations for title and abstract
*/
export default class TranslationsComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-translations')
    el.append(
      this._renderTitleTranslations($$),
      this._renderAbstractTranslations($$)
    )
    return el
  }

  _renderTitleTranslations($$) {
    let articleMeta = this.props.node
    let transTitleGroup = articleMeta.find('title-group trans-title-group')
    console.log('transTitleGroup', transTitleGroup)
    return $$('div').addClass('se-title-translations')
  }

  _renderAbstractTranslations($$) {
    let articleMeta = this.props.node
    let transAbstractGroup = articleMeta.find('trans-abstract-group')
    console.log('transAbstractGroup', transAbstractGroup)
    return $$('div').addClass('se-abstract-translations')
  }

}
