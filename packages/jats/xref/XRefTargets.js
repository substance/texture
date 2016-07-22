import clone from 'lodash/clone'
import find from 'lodash/find'
import without from 'lodash/without'
import Component from 'substance/ui/Component'
import getXRefTargets from './getXRefTargets'

class XRefTargets extends Component {
  getInitialState() {
    return {
      targets: getXRefTargets(this.props.node)
    }
  }

  render($$) {
    var el = $$('div').addClass('sc-xref-targets');
    var componentRegistry = this.context.componentRegistry;

    this.state.targets.forEach(function(target) {
      var TargetComponent = componentRegistry.get(target.node.type+'-target')
      var props = clone(target);
      // disable editing in TargetComponent
      props.disabled = true
      el.append(
        $$(TargetComponent, props)
          .on('click', this._toggleTarget.bind(this, target.node))
      )
    }.bind(this))
    return el;
  }

  _toggleTarget(targetNode) {
    var node = this.props.node
    var surface = this.context.surfaceManager.getFocusedSurface()

    // Update model
    var newTargets = node.targets;
    if (newTargets.indexOf(targetNode.id) > 0) {
      newTargets = without(newTargets, targetNode.id)
    } else {
      newTargets.push(targetNode.id)
    }

    // Compute visual feedback
    var targets = this.state.targets;
    var target = find(this.state.targets, function(t) {
      return t.node === targetNode
    })

    // Flip the selected flag
    target.selected = !target.selected

    // Triggers a rerender
    this.setState({
      targets: targets
    })

    // ATTENTION: still we need to use surface.transaction()
    surface.transaction(function(tx) {
      tx.set([node.id, 'targets'], newTargets)
    })
  }
}

export default XRefTargets