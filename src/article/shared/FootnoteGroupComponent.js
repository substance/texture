import { Component } from 'substance'

export default class FootnoteGroupComponent extends Component {
  didMount () {
    this.context.appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: ['footnotes'] } })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  getInitialState () {
    const footnotes = this._getFootnotes()
    return {
      hidden: (footnotes.length === 0)
    }
  }

  render ($$) {
    const FootnoteComponent = this.getComponent('fn')
    const SectionLabel = this.getComponent('section-label')
    const footnotes = this._getFootnotes()

    let el = $$('div').addClass('sc-footnote-group')
      .attr('data-id', 'fn-group')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    if (footnotes.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'footnotes-label'})
      )
    }

    footnotes.forEach(model => {
      let node = model._node
      el.append(
        $$(FootnoteComponent, { model, node }).ref(model.id)
      )
    })

    return el
  }

  _getFootnotes () {
    let model = this.props.model
    let footnotes = model.getItems()
    return footnotes
  }
}
