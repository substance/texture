import Component from 'substance/ui/Component'
import clone from 'lodash/clone'
import Modal from 'substance/ui/Modal'
import XRefTargets from './XRefTargets'
import Prompt from 'substance/ui/Prompt'
import deleteSelection from 'substance/model/transform/deleteSelection'

/*
  Edit a reference in a prompt.
*/
class XRefTool extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'closeModal': this._doneEditing,
      'doneEditing': this._doneEditing
    })
  }

  render($$) {
    var node = this.props.node
    var el = $$('div').addClass('sc-xref-tool')

    el.append(
      $$(Prompt).append(
        $$(Prompt.Label, {label: this.getLabel('xref')}),
        $$(Prompt.Separator),
        $$(Prompt.Action, {name: 'edit', title: this.getLabel('edit-xref')})
          .on('click', this._onEdit),
        $$(Prompt.Action, {name: 'delete', title: this.getLabel('delete-xref')})
          .on('click', this._onDelete)
      )
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
    this.setState({edit: true})
  }

  _doneEditing() {
    this.setState({edit: false})
  }

  _onDelete() {
    var ds = this.context.documentSession;
    ds.transaction(function(tx, args) {
      return deleteSelection(tx, args)
    })
  }

}

XRefTool.getProps = function(commandStates) {
  if (commandStates['xref'].active) {
    return clone(commandStates['xref'])
  } else {
    return undefined;
  }
};

export default XRefTool