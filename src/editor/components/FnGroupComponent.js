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
    editorSession.transaction((doc) => {
      let fnGroup = doc.find('fn-group')
      let fn = doc.createElement('fn')
      let fnPlaceholder = doc.createElement('p')
      fn.append(fnPlaceholder)
      fnGroup.append(fn)
    })
    this.rerender()
  }

  _removeFn(fnId) {
    let editorSession = this.context.editorSession
    editorSession.transaction(doc => {
      let xrefIndex = doc.getIndex('xrefs')
      let xrefs = xrefIndex.get(fnId)
      xrefs.forEach((xrefId) => {
        let xref = doc.get(xrefId)
        let idrefs = xref.attr('rid').split(' ')
        idrefs = without(idrefs, fnId)
        xref.setAttribute('rid', idrefs.join(' '))
      })
      let fnGroup = doc.find('fn-group')
      let fn = fnGroup.find(`fn#${fnId}`)
      fnGroup.removeChild(fn)
    })
    this.rerender()
  }
}