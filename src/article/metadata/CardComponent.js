import { Component, domHelpers, $$ } from 'substance'

export default class CardComponent extends Component {
  didMount () {
    // Note: without a 'managed' approach every card component needs to listen to selection updates
    // TODO: consider to use a reducer that maps the selection to another variable, e.g. activeCard
    // then the cards would not be triggered on every other change
    this.context.editorState.addObserver(['selection'], this._onSelectionChange, this, { stage: 'render' })
  }

  dispose () {
    this.context.editorState.removeObserver(this)
  }

  render () {
    const node = this.props.node
    const nodeId = node.id
    const children = this.props.children
    const label = this.getLabel(this.props.label)
    const el = $$('div')
      .addClass(this._getClassNames())
      .attr('data-id', nodeId)
      .append(
        $$('div').addClass('se-label').append(label)
      )
    el.append(children)
    el.on('mousedown', this._onMousedown)
    el.on('click', this._onClick)
    return el
  }

  _getClassNames () {
    return `sc-card sm-${this.props.node.type}`
  }

  _toggleCardSelection () {
    const node = this.props.node
    const api = this.context.api
    api.selectCard(node.id)
  }

  _onSelectionChange (sel) {
    if (sel && sel.customType === 'card') {
      if (sel.nodeId === this.props.node.id) {
        this.el.addClass('sm-selected')
      } else {
        this.el.removeClass('sm-selected')
      }
    } else {
      this.el.removeClass('sm-selected')
    }
  }

  _onMousedown (e) {
    // Note: stopping propagation so that no-one else is doing somthing undesired
    // and selecting the card on right-mousedown
    e.stopPropagation()
    if (e.button === 2) {
      this._toggleCardSelection()
    }
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    this._toggleCardSelection()
  }
}
