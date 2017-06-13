import { Component, FontAwesomeIcon as Icon } from 'substance'
import MetadataSection from './MetadataSection'
import { getStringAffs } from '../util'

/*
  Edit affiliations for a publication in this MetadataSection
*/
export default class Affiliatons extends Component {

  getInitialState() {
    return {
      expanded: true
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-affiliations')
    let stringAffs = getStringAffs(this.context.editorSession)
    let TextPropertyEditor = this.getComponent('text-property-editor')

    el.append(
      $$(MetadataSection, {
        label: 'Affiliations',
        expanded: this.state.expanded
      }).on('click', this._toggle)
    )

    if (this.state.expanded) {
      stringAffs.forEach((stringAff) => {
        el.append(
          $$('div').addClass('se-aff').append(
            $$(TextPropertyEditor, {
              history: 'affs',
              path: stringAff.getTextPath(),
              disabled: this.props.disabled
            }).ref(stringAff.id)
          )
        )
      })

      el.append(
        $$('button')
          .append('Add Affiliation')
          .on('click', this._addAffiliation)
      )
    }
    return el
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  _addAffiliation() {
    let editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let affGroup = doc.find('aff-group')
      let aff = doc.createElement('aff').attr('aff-type', 'foo')
      aff.append(
        doc.createElement('string-aff')
      )
      affGroup.append(aff)
    })
  }
}