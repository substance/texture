import { Tool, clone, find, without } from 'substance'
import { getAvailableXrefTargets, getXrefTargets } from '../util'

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
    return {
      targets: getAvailableXrefTargets(this._getNode(nodeId), this.context.labelGenerator)
    }
  }

  willReceiveProps(props) {
    let newState = this._computeState(props.commandState.nodeId)
    this.setState(newState)
  }

  // this.dispose = function() {
  //   console.log('XRefTargets.dispose', this.__id__);
  // };

  render($$) {
    let el = $$('div').addClass('sc-edit-xref-tool')
    this.state.targets.forEach(function(target) {
      let TargetComponent = this.getComponent(target.node.type+'-preview')
      let props = clone(target)
      // Disable editing in TargetComponent
      props.disabled = true
      el.append(
        $$(TargetComponent, props)
          .on('click', this._toggleTarget.bind(this, target.node))
      )
    }.bind(this))
    return el
  }

  _toggleTarget(targetNode) {
    let node = this._getNode(this.props.commandState.nodeId)
    let editorSession = this.context.editorSession
    // console.log('XRefTargets: toggling target of ', node.id);

    // Update model
    let newTargets = getXrefTargets(node)
    if (newTargets.indexOf(targetNode.id) >= 0) {
      newTargets = without(newTargets, targetNode.id)
    } else {
      newTargets.push(targetNode.id)
    }

    // Compute visual feedback
    let targets = this.state.targets;
    let target = find(this.state.targets, function(t) {
      return t.node === targetNode
    })

    // Flip the selected flag
    target.selected = !target.selected

    editorSession.transaction(function(doc) {
      let xref = doc.get(node.id)
      xref.setAttribute('rid', newTargets.join(' '))
    })

    // Triggers a rerender
    this.setState({
      targets: targets
    })
  }
}
