import { Component } from 'substance'

export default class CardComponent extends Component {
  didMount () {
    // Note: without a 'managed' approach every card component needs to listen to selection updates
    // TODO: consider to use a reducer that maps the selection to another variable, e.g. activeCard
    // then the cards would not be triggered on every other change
    this.context.appState.addObserver(['selection'], this._onSelectionChange, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const children = this.props.children
    const label = this.getLabel(this.props.label)
    const el = $$('div').addClass('sc-card')
      .append(
        $$('div').addClass('se-label').append(label)
      )
    el.append(children)
    el.on('click', this._toggleCardSelection)
    return el
  }

  _toggleCardSelection () {
    this.context.api.selectCard(this.props.modelId)
  }

  _onSelectionChange (sel) {
    if (sel && sel.customType === 'model') {
      if (sel.data.modelId === this.props.modelId) {
        this.el.addClass('sm-selected')
      } else {
        this.el.removeClass('sm-selected')
      }
    } else {
      this.el.removeClass('sm-selected')
    }
  }
}
