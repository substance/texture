import { Component } from 'substance'
import { renderModel } from '../../kit'
import CardComponent from '../shared/CardComponent'

export default class ArticleRecordComponent extends Component {
  render ($$) {
    const model = this.props.model
    const el = $$('div').addClass('sc-article-record')
    const cards = model.cards.map(card => this._renderCardEditor($$, card))
    return el.append(cards)
  }

  // NOTE: we are looking for a fake models with node inside
  // and retreiving components for those nodes,
  // for real models we are rendering model editor.
  _renderCardEditor ($$, card) {
    const model = card.model
    let editorEl, node
    if (model.node) {
      const EditorClass = this.getComponent(model.id)
      editorEl = $$(EditorClass, {node: model.node})
      node = model.node
    } else {
      // HACK: for model editing (e.g. title, abstract) we are passing
      // model as node to avoid errors
      node = model
      editorEl = renderModel($$, this, card.model)
    }
    return $$(CardComponent, { label: card.name, node: node }).append(editorEl)
  }
}
