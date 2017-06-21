import { Component } from 'substance'
import Navigator from './Navigator'

export default class ContextSection extends Component {

  getInitialState() {
    return {
      contextId: 'toc'
    }
  }

  didMount() {
    this.handleActions({
      'navigate': this._navigate
    })
  }

  /*
    Renders Navigator which shows a label for the active panel, and when
    clicked brings up a dropdown to navigate.
  */
  render($$) {
    const ScrollPane = this.getComponent('scroll-pane')
    const panelsSpec = this.props.panelsSpec
    let el = $$('div').addClass('sc-context-section')
    let ComponentClass = this.getComponent(this.state.contextId)
    el.append(
      $$(Navigator, {
        contextId: this.state.contextId,
        panelsSpec: panelsSpec
      }).ref('navigator'),
      $$(ScrollPane)
        .append(
          $$(ComponentClass)
        )
        .ref('contextSectionScroll')
    )
    return el
  }

  _navigate(contextId) {
    this.setState({
      contextId: contextId
    })
  }
}
