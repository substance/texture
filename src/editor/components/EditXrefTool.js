import { Tool, find, without } from 'substance'
import { getXrefTargets, getAvailableXrefTargets } from '../util/xrefHelpers'

/*
  Editing of XRefTargets
*/
export default class EditXRefTool extends Tool {


  _getNode(nodeId) {
    return this.context.editorSession.getDocument().get(nodeId)
  }

  getInitialState() {
    return this._computeState(this.props.commandState.nodeId)
  }

  _computeState(nodeId) {
    let targets = getAvailableXrefTargets(this._getNode(nodeId), this.context)
    return {
      targets
    }
  }

  willReceiveProps(props) {
    let newState = this._computeState(props.commandState.nodeId)
    this.setState(newState)
  }

  render($$) {
    let el = $$('div').addClass('sc-edit-xref-tool')
    this.state.targets.forEach((target) => {
      let targetPreviewEl
      if (target.node) {
        targetPreviewEl = this._renderPreview($$, target)
      } else {
        // HACK: We just manually replicate the markup of RefPreviewComponent
        targetPreviewEl = $$('div').addClass('sc-ref-preview').append(
          $$('div').addClass('se-label').append('[!]'),
          $$('div').addClass('se-text').append(`No target found for "${target.id}"`)
        )
        if (target.selected) {
          targetPreviewEl.addClass('sm-selected')
        }
      }
      targetPreviewEl.on('click', this._toggleTarget.bind(this, target.id), this)
      el.append(targetPreviewEl)
    })
    return el
  }

  _renderPreview($$, target) {
    let TargetComponent = this.getComponent(target.node.type+'-preview')
    let props = Object.assign({}, target)
    // disable editing in TargetComponent
    props.disabled = true
    return $$(TargetComponent, props)
  }

  _toggleTarget(targetNodeId, e) {
    // Make sure we don't follow external links
    e.preventDefault()

    let node = this._getNode(this.props.commandState.nodeId)
    let editorSession = this.context.editorSession
    // console.log('XRefTargets: toggling target of ', node.id);

    // Update model
    let newTargets = getXrefTargets(node)
    if (newTargets.indexOf(targetNodeId) >= 0) {
      newTargets = without(newTargets, targetNodeId)
    } else {
      newTargets.push(targetNodeId)
    }

    // Compute visual feedback
    let targets = this.state.targets;
    let target = find(this.state.targets, function(t) {
      return t.id === targetNodeId
    })

    // Flip the selected flag
    target.selected = !target.selected

    editorSession.transaction(tx => {
      let xref = tx.get(node.id)
      xref.setAttribute('rid', newTargets.join(' '))
    })

    // Triggers a rerender
    this.setState({
      targets: targets
    })
  }
}
