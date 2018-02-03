import { Component } from 'substance'
// import Navigator from './Navigator'

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

  _getNode() {
    const doc = this.context.editorSession.getDocument()
    if (this.state.nodeId) {
      return doc.get(this.state.nodeId)
    } else {
      let selector = 'article-meta'
      return doc.find(selector)
    }
  }

  /*
    Renders Navigator which shows a label for the active panel, and when
    clicked brings up a dropdown to navigate.
  */
  render($$) {
    // const panelsSpec = this.props.panelsSpec
    let contextId = this.state.contextId
    let node = this._getNode()
    let el = $$('div').addClass('sc-context-section')

    let ComponentClass = this.getComponent(contextId)
    // el.append(
    //   $$(Navigator, {
    //     contextId: contextId,
    //     panelsSpec: panelsSpec
    //   }).ref('navigator')
    // )
    if (!node) {
      console.error('FIXME: could not find node for context section.')
    } else {
      el.append(
        $$('div').addClass('se-context-content').append(
          $$(ComponentClass, {
            node: node
          })
        )
      )
    }
    return el
  }

  _navigate(contextId) {
    this.setState({
      contextId: contextId
    })
  }
}
