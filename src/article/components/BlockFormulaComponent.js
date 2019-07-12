import { NodeComponent, NodeOverlayEditorMixin } from '../../kit'
import katex from 'katex'
import { PREVIEW_MODE } from '../ArticleConstants'
import BlockFormulaEditor from './BlockFormulaEditor'
import PreviewComponent from './PreviewComponent'
import { getLabel } from '../shared/nodeHelpers'

export default class BlockFormulaComponent extends NodeOverlayEditorMixin(NodeComponent) {
  getInitialState () {
    return this._deriveState(this.props, {})
  }

  willUpdateProps (newProps) {
    this.setState(this._deriveState(newProps))
  }

  render ($$) {
    const mode = this.props.mode
    const node = this.props.node
    const label = getLabel(node) || '?'
    const source = node.content
    const state = this.state

    if (mode === PREVIEW_MODE) {
      let description = $$('div').html(state.html)
      if (state.error) description.addClass('sm-error')
      return $$(PreviewComponent, {
        id: node.id,
        label,
        description
      })
    }

    let el = $$('div')
      .addClass('sc-block-formula')
      .attr('data-id', node.id)

    let content = $$('div').addClass('se-content')
    if (!source) {
      content.append('?')
    } else {
      content.append(
        $$('div').addClass('se-formula').html(state.html || state.lastHtml)
      )
    }
    content.append(
      $$('div').addClass('se-label').append(label)
    )

    el.append(
      content
    )

    if (this.state.error) {
      el.addClass('sm-error')
      el.append(
        $$('div').addClass('se-error').text(this.state.error.message)
      )
    }

    // TODO: what is this for?
    el.append($$('div').addClass('se-blocker'))

    return el
  }

  _onNodeUpdate () {
    this.setState(this._deriveState(this.props, this.state))
  }

  _deriveState (props, oldState) {
    try {
      let html = katex.renderToString(props.node.content)
      return { html, lastHtml: html }
    } catch (error) {
      return {
        error,
        html: '',
        lastHtml: oldState.lastHtml
      }
    }
  }

  _getEditorClass () {
    return BlockFormulaEditor
  }

  _shouldEnableOverlayEditor () {
    return this.props.mode !== PREVIEW_MODE
  }
}
