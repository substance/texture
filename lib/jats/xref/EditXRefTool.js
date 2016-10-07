'use strict';

import { deleteSelection, Tool } from 'substance'
import XRefTargets from './XRefTargets'

/*
  Shown in OverlayTools
*/
class EditXRefTool extends Tool {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'closeModal': this._doneEditing,
      'doneEditing': this._doneEditing
    })
  }

  render($$) {
    let Modal = this.getComponent('modal')
    let Button = this.getComponent('button')

    let node = this.props.node
    let el = $$('div').addClass('sc-edit-xref-tool')

    el.append(
      $$(Button, {
        icon: 'edit',
        style: this.props.style
      })
      .attr('title', this.getLabel('edit-xref'))
      .on('click', this._onEdit),
      $$(Button, {
        icon: 'delete',
        style: this.props.style
      })
      .attr('title', this.getLabel('delete-xref'))
      .on('click', this._onDelete)
    )

    if (this.state.edit) {
      el.append(
        $$(Modal, {
          width: 'large'
        }).append(
          $$(XRefTargets, {
            node: node
          }).ref('targets')
        )
      )
    }
    return el;
  }

  _onEdit() {
    this.setState({
      edit: true
    })
  }

  _doneEditing() {
    this.setState({
      edit: false
    })
  }

  _onDelete() {
    var ds = this.context.documentSession;
    ds.transaction(function(tx, args) {
      return deleteSelection(tx, args)
    })
  }
}

export default EditXRefTool;
