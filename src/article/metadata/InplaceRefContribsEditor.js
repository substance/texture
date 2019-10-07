import { $$ } from 'substance'
import { NodeComponent, FormRowComponent, ValueComponent } from '../../kit'

// ATTENTION: this is displays all RefContribs of a Reference in an 'in-place' style i.e. like a little table
export default class InplaceRefContribsEditor extends ValueComponent {
  getActionHandlers () {
    return {
      removeContrib: this._removeContrib
    }
  }
  render () {
    const Button = this.getComponent('button')

    let el = $$('div').addClass('sc-inplace-ref-contrib-editor')
    el.append(this._renderRefContribs())
    el.append(
      $$(Button, {
        icon: 'insert'
      }).addClass('se-add-value')
        .on('click', this._addContrib)
    )
    return el
  }

  _renderRefContribs () {
    const model = this.props.model
    let items = model.getItems()
    return items.map(item => this._renderRefContrib(item))
  }

  _renderRefContrib (refContrib) {
    let id = refContrib.id
    return $$(InplaceRefContribEditor, { node: refContrib }).ref(id)
  }

  _addContrib () {
    this.props.model.addItem({ type: 'ref-contrib' })
  }

  _removeContrib (contrib) {
    this.props.model.removeItem(contrib)
  }
}

class InplaceRefContribEditor extends NodeComponent {
  render () {
    const node = this.props.node
    const Button = this.getComponent('button')
    let el = $$('div').addClass('sc-inplace-ref-contrib-editor')
    el.append(
      $$(FormRowComponent).attr('data-id', node.id).addClass('sm-ref-contrib').append(
        this._renderValue('name', {
          placeholder: this.getLabel('name')
        }).addClass('sm-name'),
        this._renderValue('givenNames', {
          placeholder: this.getLabel('given-names')
        }).addClass('sm-given-names'),
        $$(Button, {
          icon: 'remove'
        // TODO: do we need this ref?
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
