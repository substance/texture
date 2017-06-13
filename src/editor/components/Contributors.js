import { Component, FontAwesomeIcon as Icon } from 'substance'
import MetadataSection from './MetadataSection'
import { getStringAffs, getContribs } from '../util'

/*
  Edit affiliations for a publication in this MetadataSection
*/
export default class Contributors extends Component {

  getInitialState() {
    return {
      expanded: true
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-affiliations')
    let stringAffs = getStringAffs(this.context.editorSession)
    let contribs = getContribs(this.context.editorSession)


    el.append(
      $$(MetadataSection, {
        label: 'Contributors',
        expanded: this.state.expanded
      }).on('click', this._toggle)
    )

    if (this.state.expanded) {
      contribs.forEach((contrib) => {
        el.append(
          this._renderName($$, contrib),
          this._renderAffiliations($$, contrib)
        )
      })

      el.append(
        $$('button')
          .append('Add Contributor')
          .on('click', this._addContributor)
      )
    }
    return el
  }

  _renderName($$, contrib) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let stringContrib = contrib.find('string-contrib')
    return $$('div').addClass('se-name').append(
      $$('div').addClass('se-label').append('Name'),
      $$(TextPropertyEditor, {
        path: stringContrib.getTextPath(),
        disabled: this.props.disabled
      }).ref(stringContrib.id)
    )
  }

  _renderAffiliations($$, contrib) {
    return $$('div')
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  _addContributor() {
    // TODO:
  }
}