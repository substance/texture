import { Component } from 'substance'

export default class MetadataComponent extends Component {

  render($$) {
    const doc = this.context.editorSession.getDocument()
    const articleMeta = doc.find('article-meta')

    let el = $$('div').addClass('sc-metadata')

    const contribGroup = articleMeta.findChild('contrib-group')
    if (contribGroup) {
      el.append($$(this.getComponent('contributors'), { node: contribGroup }))
    }

    const affGroup = articleMeta.findChild('aff-group')
    if (affGroup) {
      el.append($$(this.getComponent('affiliations'), { node: affGroup }))
    }

    return el
  }
}