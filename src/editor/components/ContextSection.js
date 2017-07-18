import { Component } from 'substance'
import Navigator from './Navigator'

// HACK: we need this info to pass the right node to the component shown in the
// context panel. By default we pass article-meta as the
// TODO: we need a better solution to this, so a new metadata panel can
// be introduced without having to update this map
let NODE_SELECTORS = {
  'contributors': 'article-meta contrib-group',
  'affiliations': 'article-meta aff-group',
  'pub-history': 'article-meta > history',
}

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
      let selector = NODE_SELECTORS[this.state.contextId] || 'article-meta'
      return doc.find(selector)
    }
  }

  /*
    Renders Navigator which shows a label for the active panel, and when
    clicked brings up a dropdown to navigate.
  */
  render($$) {
    const ScrollPane = this.getComponent('scroll-pane')
    const panelsSpec = this.props.panelsSpec
    let contextId = this.state.contextId
    let node = this._getNode()
    let el = $$('div').addClass('sc-context-section')

    let ComponentClass = this.getComponent(contextId)
    el.append(
      $$(Navigator, {
        contextId: contextId,
        panelsSpec: panelsSpec
      }).ref('navigator')
    )
    if (!node) {
      console.error('FIXME: could not find node for context section.')
    } else {
      el.append(
        $$(ScrollPane)
          .append(
            $$(ComponentClass, {
              node: node
            })
          )
          .ref('contextSectionScroll')
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
