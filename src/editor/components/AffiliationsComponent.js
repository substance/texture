import { NodeComponent, FontAwesomeIcon as Icon } from 'substance'

/*
  Edit affiliations for a publication in this MetadataSection
*/
export default class AffiliationsComponent extends NodeComponent {

  render($$) {
    const affGroup = this.props.node
    const TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$('div').addClass('sc-affiliations')

    affGroup.getChildren().forEach((aff) => {
      let stringAff = aff.findChild('string-aff')
      // at the moment we only render string-affs
      if (stringAff) {
        el.append(
          $$('div').addClass('se-aff').append(
            $$(TextPropertyEditor, {
              history: 'affs',
              path: stringAff.getTextPath(),
              disabled: this.props.disabled
            }).addClass('se-text-input').ref(stringAff.id),
            $$('div').addClass('se-remove-aff').append(
              $$(Icon, { icon: 'fa-trash' })
            ).on('click', this._removeAffiliation.bind(this, aff.id))
          )
        )
      }
    })

    el.append(
      $$('button').addClass('se-metadata-affiliation-add')
        .append('Add Affiliation')
        .on('click', this._addAffiliation)
    )
    return el
  }

  _addAffiliation() {
    const nodeId = this.props.node.id
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let affGroup = doc.get(nodeId)
      let aff = doc.createElement('aff').attr('aff-type', 'foo')
      aff.append(
        doc.createElement('string-aff')
      )
      affGroup.append(aff)
    })
  }

  _removeAffiliation(affId) {
    const nodeId = this.props.node.id
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      const affGroup = doc.get(nodeId)
      let aff = affGroup.find(`aff#${affId}`)
      affGroup.removeChild(aff)
    })
  }
}
