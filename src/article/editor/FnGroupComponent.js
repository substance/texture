import NodeComponent from '../shared/NodeComponent'
import removeElementAndXrefs from '../shared/removeElementAndXrefs'
import Button from './Button'
import { getPos } from '../shared/nodeHelpers'

export default class FnGroupComponent extends NodeComponent {

  getInitialState() {
    const node = this.props.node
    let fns = node.findAll('fn')
    return {
      hidden: fns.length === 0
    }
  }

  didMount() {
    super.didMount()
    this.handleActions({
      'removeFn': this._removeFn
    })
  }

  render($$) {
    const node = this.props.node
    let el = $$('div').addClass('sc-fn-group')
      .attr('data-id', 'fn-group')

    if (this.state.hidden) {
      el.addClass('sm-hidden')
      return el
    }

    let fns = node.findAll('fn')

    if (fns.length > 0) {
      el.append(
        $$('div').addClass('se-title').append('Footnotes')
      )
    }

    fns.sort((a,b) => {
      return getPos(a) - getPos(b)
    })
    fns.forEach((fn) => {
      let FnComponent = this.getComponent('fn')
      el.append(
        $$(FnComponent, { node: fn }).ref(fn.id)
      )
    })

    el.append(
      $$(Button, {style: 'big', label: 'Add Footnote'})
        .on('click', this._addFn)
    )
    return el
  }

  _onLabelsChanged(refType) {
    if (refType === 'fn') {
      this.rerender()
    }
  }

  /*
    Insert new Footnote

    <fn id="fn2">
      <p>Please enter footnote content</p>
    </fn>
  */
  _addFn() {
    const editorSession = this.context.editorSession
    editorSession.transaction((tx) => {
      let fnGroup = tx.find('fn-group')
      let fn = tx.createElement('fn')
      let fnPlaceholder = tx.createElement('p')
      fn.append(fnPlaceholder)
      fnGroup.append(fn)
      tx.setSelection(null)
    })
    this.rerender()
  }

  _removeFn(fnId) {
    let editorSession = this.context.editorSession
    const doc = editorSession.getDocument()
    const parent = doc.find('fn-group')
    removeElementAndXrefs(editorSession, fnId, parent)
    this.rerender()
  }
}
