import { renderNode, NodeComponent } from '../../kit'
import { PREVIEW_MODE } from '../../article/ArticleConstants'

export default class XrefEditor extends NodeComponent {
  render ($$) {
    const targets = this._getAvailableTargets()
    let el = $$('div').addClass('sc-edit-xref-tool')
    // ATTENTION the targets are not models or nodes, but entries
    // created by xrefHelpers
    // TODO: use something more idiomatic
    for (let entry of targets) {
      const target = entry.node
      if (!target) continue
      const selected = entry.selected
      let targetPreviewEl = this._renderOption($$, target, selected)
      targetPreviewEl.on('click', this._toggleTarget.bind(this, target.id), this)
      el.append(targetPreviewEl)
    }
    return el
  }

  _renderOption ($$, target, selected) {
    let optionEl = $$('div').addClass('se-option').append(
      renderNode($$, this, target, {
        mode: PREVIEW_MODE
      })
    )
    if (selected) {
      optionEl.addClass('sm-selected')
    }
    return optionEl
  }

  _getNode () {
    return this.props.node
  }

  _getAvailableTargets () {
    let node = this._getNode()
    return this.context.api._getAvailableXrefTargets(node)
  }

  _toggleTarget (targetNodeId, e) {
    // Make sure we don't follow external links
    e.preventDefault()
    e.stopPropagation()
    let node = this._getNode()
    let targets = this.context.api._toggleXrefTarget(node, targetNodeId)
    this.setState({ targets })
  }
}
