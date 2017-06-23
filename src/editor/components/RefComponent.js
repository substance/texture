import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class RefComponent extends Component {
  render($$) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$('div').addClass('sc-ref')
    let ref = this.props.node
    let label = this.context.labelGenerator.getPosition('bibr', ref.id)

    let stringCitation = ref.find('string-citation')
    if (stringCitation) {
      let stringCitationEl = $$('div').addClass('sc-string-citation')
      if(label) {
        stringCitationEl.append(
          $$('div').addClass('se-label').append(
            label
          )
        )
      }
      stringCitationEl.append(
        $$(TextPropertyEditor, {
          path: stringCitation.getTextPath(),
          disabled: this.props.disabled
        }),
        $$('div').addClass('se-remove-ref')
          .append(
            $$(Icon, { icon: 'fa-trash' })
          )
          .on('click', this._removeRef.bind(this, ref.id))
      )
      el.append(stringCitationEl)
    } else {
      console.warn('No string citation found')
    }
    return el
  }

  _removeRef(refId) {
    let editorSession = this.context.editorSession
    let docSource = editorSession.getDocument()
    let xrefs = docSource.getXRefs()
    let needRerender = true
    editorSession.transaction(doc => {
      xrefs.forEach(xrefItem => {
        let xref = doc.get(xrefItem.id)
        let idrefsString = xref.getAttribute('rid')
        let idrefs = idrefsString.split(' ')
        let ridIndex = idrefs.indexOf(refId)
        if(ridIndex > -1) {
          idrefs.splice(ridIndex, 1)
          xref.setAttribute('rid', idrefs.join(' '))
          needRerender = false
        }
      })
      let refList = doc.find('ref-list')
      let ref = refList.find(`ref#${refId}`)
      refList.removeChild(ref)
    })
    if(needRerender) this.parent.rerender()
  }
}

