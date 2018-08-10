import { ToggleTool } from '../../kit'
import getComponentForModel from '../shared/getComponentForModel'

export default class EditXRefTool extends ToggleTool {
  render ($$) {
    const targets = this._getAvailableTargets()

    let el = $$('div').addClass('sc-edit-xref-tool')
    // ATTENTION the targets are not models or nodes, but entries
    // created by xrefHelpers.getAvailableTargets()
    // TODO: use something more idiomatic
    targets.forEach(entry => {
      const target = entry.model
      const selected = entry.selected
      let targetPreviewEl = this._renderPreview($$, target)
      if (selected) {
        targetPreviewEl.addClass('sm-selected')
      }
      targetPreviewEl.on('click', this._toggleTarget.bind(this, target.id), this)
      el.append(targetPreviewEl)
    })
    return el
  }

  _renderPreview ($$, target) {
    let TargetComponent = getComponentForModel(this.context, target)
    return $$(TargetComponent, { model: target, mode: 'preview' })
  }

  _getModel () {
    // TODO: we should name this 'modelId'
    let id = this.props.commandState.nodeId
    return this.context.api.getModelById(id)
  }

  _getAvailableTargets () {
    const model = this._getModel()
    return model.getAvailableTargets()
  }

  _toggleTarget (targetNodeId, e) { // eslint-disable-line
    // TODO: implement this in a model idiomatic way
    console.error('TODO: implement EditXRefTool._toggleTarget()')

    // // Make sure we don't follow external links
    // e.preventDefault()
    // e.stopPropagation()

    // let node = this._getNode(this.props.commandState.nodeId)
    // let editorSession = this.context.editorSession
    // // console.log('XRefTargets: toggling target of ', node.id);

    // // Update model
    // let newTargets = getXrefTargets(node)
    // if (newTargets.indexOf(targetNodeId) >= 0) {
    //   newTargets = without(newTargets, targetNodeId)
    // } else {
    //   newTargets.push(targetNodeId)
    // }

    // // Compute visual feedback
    // let targets = this.state.targets;
    // let target = find(this.state.targets, function(t) {
    //   return t.id === targetNodeId
    // })

    // // Flip the selected flag
    // target.selected = !target.selected

    // editorSession.transaction(tx => {
    //   let xref = tx.get(node.id)
    //   xref.setAttribute('rid', newTargets.join(' '))
    // })

    // // Triggers a rerender
    // this.setState({
    //   targets: targets
    // })
  }
}
