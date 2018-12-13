import CollectionEditor from './CollectionEditor'
import { METADATA_MODE } from '../ArticleConstants'
import CardComponent from '../shared/CardComponent'

export default class FigurePanelsComponent extends CollectionEditor {
  render ($$) {
    const model = this.props.model
    const figures = model.getItems()
    const panels = figures.map(f => f.getPanels().getItems())
      .reduce((acc, arr) => [...acc, ...arr], [])
    let el = $$('div').addClass('sc-collection-editor')
    panels.forEach(item => {
      let ItemEditor = this._getItemComponentClass(item)
      el.append(
        $$(CardComponent, {
          model: item,
          label: 'figure'
        }).append(
          $$(ItemEditor, {
            model: item,
            mode: METADATA_MODE,
            node: item._node
          }).ref(item.id)
        )
      )
    })
    return el
  }
}
