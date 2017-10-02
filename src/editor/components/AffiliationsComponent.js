import { NodeComponent } from 'substance'
import Button from './Button'

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
              placeholder: 'Enter affiliation title',
              path: stringAff.getPath(),
              disabled: this.props.disabled
            }).addClass('se-text-input').ref(stringAff.id),
            $$(Button, {icon: 'trash'})
              .on('click', this._removeAffiliation.bind(this, aff.id))
          )
        )
      }
    })

    el.append(
      $$(Button, {style: 'big', label: 'Add Affiliation'})
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
