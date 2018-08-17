import { FontAwesomeIcon } from 'substance'
import {
  FormRowComponent, ValueComponent, StringModelEditor
} from '../../kit'

export default class InplaceRefContribEditor extends ValueComponent {
  render ($$) {
    let el = $$('div').addClass('sc-inplace-ref-contrib-editor')
    el.append(this._renderChildren($$))
    el.append(
      $$('button').addClass('se-add-value')
        // TODO: use icon provider
        .append(
          $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon'),
          'Add contributor'
        )
        .on('click', this._addContrib)
    )
    return el
  }

  _renderChildren ($$) {
    const model = this.props.model
    let children = model.getChildren()
    return children.map(child => this._renderChild($$, child))
  }

  _renderChild ($$, refContrib) {
    let id = refContrib.id
    let givenNames = refContrib.getGivenNames()
    let name = refContrib.getName()
    return $$(FormRowComponent).append(
      // TODO: it would be good to have a default factory for property editors
      $$(StringModelEditor, { label: this.getLabel(givenNames.name), model: givenNames.model }),
      $$(StringModelEditor, { label: this.getLabel(name.name), model: name.model }),
      // TODO: use icon provider
      $$('button').addClass('se-remove-value')
        .append($$(FontAwesomeIcon, {icon: 'fa-trash'}))
        .on('click', this._removeContrib.bind(this, refContrib))
    ).ref(id)
  }

  _addContrib () {
    const model = this.props.model
    model.appendChild({type: 'ref-contrib'})
  }

  _removeContrib (contrib) {
    const model = this.props.model
    model.removeChild(contrib)
  }
}
