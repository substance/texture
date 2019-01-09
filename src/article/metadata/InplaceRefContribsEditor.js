import {
  NodeComponent, FormRowComponent, ValueComponent
} from '../../kit'

// ATTENTION: this is displays all RefContribs of a Reference in an 'in-place' style i.e. like a little table
export default class InplaceRefContribsEditor extends ValueComponent {
  getActionHandlers () {
    return {
      removeContrib: this._removeContrib
    }
  }
  render ($$) {
    const Button = this.getComponent('button')

    let el = $$('div').addClass('sc-inplace-ref-contrib-editor')
    el.append(this._renderRefContribs($$))
    el.append(
      $$(Button, {
        icon: 'add'
      }).addClass('se-add-value')
        .on('click', this._addContrib)
    )
    return el
  }

  _renderRefContribs ($$) {
    const model = this.props.model
    let items = model.getItems()
    return items.map(item => this._renderRefContrib($$, item))
  }

  _renderRefContrib ($$, refContrib) {
    let id = refContrib.id
    return $$(InplaceRefContribEditor, { node: refContrib }).ref(id)
  }

  _addContrib () {
    const model = this.props.model
    const path = model.getPath()
    this.context.api._appendChild(path, {type: 'ref-contrib'})
  }

  _removeContrib (contrib) {
    const model = this.props.model
    const path = model.getPath()
    this.context.api._deleteChild(path, contrib)
  }
}

class InplaceRefContribEditor extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const Button = this.getComponent('button')
    let el = $$('div').addClass('sc-inplace-ref-contrib-editor')
    el.append(
      $$(FormRowComponent).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue($$, 'name', {
          label: this.getLabel('name')
        }).ref('name').addClass('sm-name'),
        this._renderValue($$, 'givenNames', {
          label: this.getLabel('given-names')
        }).ref('givenNames').addClass('sm-given-names'),
        // TODO: use icon provider
        $$(Button, {
          icon: 'remove'
        }).ref('remove-button').addClass('se-remove-value')
          .on('click', this._onRemove)
      )
    )
    return el
  }

  _onRemove () {
    this.send('removeContrib', this.props.node)
  }
}
