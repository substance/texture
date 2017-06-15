import { NodeComponent } from 'substance'

class RefListComponent extends NodeComponent {

  didMount() {
    super.didMount()
    this.context.labelGenerator.on('labels:generated', this._onLabelsChanged, this)
  }

  dispose() {
    super.dispose()
  }

  render($$) {
    const labelGenerator = this.context.labelGenerator
    const node = this.props.node

    let el = $$('div').addClass('sc-ref-list')
    // NOTE: We don't yet expose RefList.label to the editor
    let title = node.find('title')
    if (title) {
      el.append(
        $$('div').addClass('se-title').append(
          $$(this.getComponent('text-property-editor'), {
            path: title.getTextPath(),
            disabled: this.props.disabled
          })
        )
      )
    }
    let refs = node.findAll('ref')
    let entries = refs.map((ref) => {
      return {
        pos: labelGenerator.getPosition('bibr', ref.id),
        ref
      }
    })
    entries.sort((a,b) => {
      return a.pos - b.pos
    })
    entries.forEach((entry) => {
      const ref = entry.ref
      let RefComponent = this.getComponent('ref')
      el.append(
        $$(RefComponent, { node: ref })
      )
    })

    el.append(
      $$('a').attr({href: '#'})
        .append('Add Reference')
        .on('click', this._addRef)
    )
    return el
  }

  _onLabelsChanged(refType) {
    if (refType === 'bibr') {
      this.rerender()
    }
  }

  /*
    Insert new Reference

    <ref>
      <string-citation>Please enter publication name</string-citation>
    </ref>
  */
  _addRef() {
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let refList = doc.find('ref-list')
      let ref = doc.createElement('ref')
      let stringCitation = doc.createElement('string-citation')
      // TODO: Ability to add text to a text node
      // e.g. stringCitation.text('Please enter publication name')
      ref.append(stringCitation)
      refList.append(ref)
    })
    this.rerender()
  }
}


export default RefListComponent
