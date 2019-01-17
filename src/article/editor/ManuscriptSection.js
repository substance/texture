import { Component } from 'substance'
import { addModelObserver, removeModelObserver } from '../../kit'
export default class ManuscriptSection extends Component {
  didMount () {
    addModelObserver(this.props.model, this._onModelUpdate, this)
  }

  dispose () {
    removeModelObserver(this)
  }

  render ($$) {
    const { model, name, label, children, hideWhenEmpty } = this.props
    const SectionLabel = this.getComponent('section-label')

    let el = $$('div').addClass('sc-manuscript-section').addClass(`sm-${name}`)
    // only rendering content if
    if (hideWhenEmpty && model.isEmpty()) {
      el.addClass('sm-empty')
    } else {
      el.append($$(SectionLabel, { label }).ref('label'))
      el.append(children)
    }

    return el
  }

  _onModelUpdate () {
    if (this.props.hideWhenEmpty) {
      this.rerender()
    }
  }
}
