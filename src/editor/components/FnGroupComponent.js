import { NodeComponent, without } from 'substance'
import Button from './Button'
import { getPos } from '../util/nodeHelpers'

export default class FnGroupComponent extends NodeComponent {

  didMount() {
    super.didMount()

    this.handleActions({
      'removeFn': this._removeFn
    })
  }

  render($$) {
    const node = this.props.node

    let el = $$('div').addClass('sc-fn-group').append(
      $$('div').addClass('se-title').append('Footnotes')
    )

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

    if(fns.length === 0) {
      el.append(
        $$('div').addClass('se-empty-list').append(
          this.getLabel('no-footnotes')
        )
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
    let doc = editorSession.getDocument()
    let xrefIndex = doc.getIndex('xrefs')
    let xrefs = xrefIndex.get(fnId)

    if (xrefs.length === 0 || window.confirm(`If you delete this footnote, it will also be removed from ${xrefs.length} citations. Are you sure?`)) { // eslint-disable-line
      editorSession.transaction(tx => {
        xrefs.forEach((xrefId) => {
          let xref = tx.get(xrefId)
          let idrefs = xref.attr('rid').split(' ')
          idrefs = without(idrefs, fnId)
          xref.setAttribute('rid', idrefs.join(' '))
        })
        let fnGroup = tx.find('fn-group')
        let fn = fnGroup.find(`fn#${fnId}`)
        fnGroup.removeChild(fn)
      })
      this.rerender()
    }
  }
}
