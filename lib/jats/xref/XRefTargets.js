import clone from 'lodash/clone'
import find from 'lodash/find'
import without from 'lodash/without'
import { Component } from 'substance'
import getXRefTargets from './getXRefTargets'

/*
  Editing of XRefTargets
*/
class XRefTargets extends Component {

  getInitialState() {
    return {
      targets: getXRefTargets(this.props.node)
    }
  }

  // this.willReceiveProps = function() {
  //   console.log('XRefTargets.willReceiveProps', this.__id__);
  // };

  // this.dispose = function() {
  //   console.log('XRefTargets.dispose', this.__id__);
  // };

  render($$) {
    let el = $$('div').addClass('sc-xref-targets')
    let componentRegistry = this.context.componentRegistry

    this.state.targets.forEach(function(target) {
      let TargetComponent = componentRegistry.get(target.node.type+'-target')
      let props = clone(target)
      // disable editing in TargetComponent
      props.disabled = true
      el.append(
        $$(TargetComponent, props)
          .on('click', this._toggleTarget.bind(this, target.node))
      )
    }.bind(this))
    return el
  }

  _toggleTarget(targetNode) {
    let node = this.props.node
    // let surface = this.context.surfaceManager.getFocusedSurface()
    let editorSession = this.context.editorSession
    // console.log('XRefTargets: toggling target of ', node.id);

    // Update model
    let newTargets = node.targets
    if (newTargets.indexOf(targetNode.id) > 0) {
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

    // Triggers a rerender
    this.setState({
      targets: targets
    })

    // console.log('XRefTargets: setting targets of ', node.id, 'to', newTargets);
    // ATTENTION: still we need to use surface.transaction()
    editorSession.transaction(function(tx) {
      tx.set([node.id, 'targets'], newTargets)
    })
  }
}

export default XRefTargets
