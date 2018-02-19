import { NodeComponent } from 'substance'
import Button from './Button'
import { getPos } from '../util/nodeHelpers'
import removeElementAndXrefs from '../../util/removeElementAndXrefs'

export default class FnGroupComponent extends NodeComponent {

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
    let fns = node.findAll('fn')

    fns.sort((a,b) => {
      return getPos(a) - getPos(b)
    })
    fns.forEach((fn) => {
      let FnComponent = this.getComponent('fn')
      el.append(
        $$(FnComponent, { node: fn }).ref(fn.id)
      )
    })

    if( fns.length > 0) {
      el.append(
        $$('div').addClass('se-title').append('Footnotes')
      )
    }

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
    const footnoteManager = this.context.footnoteManager
    editorSession.transaction((tx) => {
      let fnGroup = tx.find('fn-group')
      let fn = tx.createElement('fn')
      let fnPlaceholder = tx.createElement('p')
      fn.append(fnPlaceholder)
      fnGroup.append(fn)
      tx.setSelection(null)
    })
    footnoteManager._updateLabels()
    this.rerender()
  }

  _removeFn(fnId) {
    let editorSession = this.context.editorSession
    const footnoteManager = this.context.footnoteManager
    const doc = editorSession.getDocument()
    const parent = doc.find('fn-group')
    removeElementAndXrefs(editorSession, fnId, parent)
    footnoteManager._updateLabels()
    this.rerender()
  }
}
