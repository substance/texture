import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class FnComponent extends Component {
  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-fn-item')
      .attr('data-id', node.id)

    let label = this.context.labelGenerator.getPosition('fn', node.id)
    let contentEl = $$(this.getComponent('container'), {
      node: node,
      disabled: this.props.disabled
    })
    
    el.append(
      $$('div').addClass('se-fn-container').append(
        $$('div').addClass('se-label').append(
          label
        ),
        contentEl,
        $$('div').addClass('se-remove-ref')
          .append(
            $$(Icon, { icon: 'fa-trash' })
          )
          .on('click', this._removeFn.bind(this, node.id))
      )
    )

    return el
  }

  _removeFn(fnId) {
    let editorSession = this.context.editorSession
    let docSource = editorSession.getDocument()
    let xrefs = docSource.getXRefs()
    let needRerender = true
    editorSession.transaction(doc => {
      xrefs.forEach(xrefItem => {
        let xref = doc.get(xrefItem.id)
        let idrefsString = xref.getAttribute('rid')
        let idrefs = idrefsString.split(' ')
        let ridIndex = idrefs.indexOf(fnId)
        if(ridIndex > -1) {
          idrefs.splice(ridIndex, 1)
          xref.setAttribute('rid', idrefs.join(' '))
          needRerender = false
        }
      })
      let fnGroup = doc.find('fn-group')
      let fn = fnGroup.find(`fn#${fnId}`)
      fnGroup.removeChild(fn)
    })
    if(needRerender) this.parent.rerender()
  }
}
