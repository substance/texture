import { ToggleTool } from '../../kit'
import renderModelComponent from '../shared/renderModelComponent'

export default class EditXRefTool extends ToggleTool {
  render ($$) {
    const targets = this._getAvailableTargets()

    let el = $$('div').addClass('sc-edit-xref-tool')
    // ATTENTION the targets are not models or nodes, but entries
    // created by xrefHelpers.getAvailableTargets()
    // TODO: use something more idiomatic
    for (let entry of targets) {
      const target = entry.model
      if (!target) continue
      const selected = entry.selected
      let targetPreviewEl = this._renderPreview($$, target, selected)
      targetPreviewEl.on('click', this._toggleTarget.bind(this, target.id), this)
      el.append(targetPreviewEl)
    }
    return el
  }

  _renderPreview ($$, target, selected) {
    return renderModelComponent(this.context, $$, {
      model: target,
      selected,
      mode: 'option'
    })
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

  _toggleTarget (targetNodeId, e) {
    // // Make sure we don't follow external links
    e.preventDefault()
    e.stopPropagation()

    const model = this._getModel()
    const targets = model.toggleTarget(targetNodeId)

    // Triggers a rerender
    this.setState({
      targets
    })
  }
}
