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
    let editorSession = this.context.editorSession
    let article = editorSession.getDocument().article
    let affs = article.findAll('aff')
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
          this._renderAffiliations($$, contrib, affs)
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

  _renderAffiliations($$, contrib, affs) {
    return $$('div').addClass('se-affiliations').append(
      $$('div').addClass('se-label').append('Affiliations'),
      this._renderAffChoices($$, contrib, affs)
    )
  }

  _renderAffChoices($$, contrib, affs) {
    let el = $$('div').addClass('')
    affs.forEach((aff) => {
      let stringAff = aff.find('string-aff')
      let selected = $$('input').attr({ type: 'checkbox' })
      if (this._getAffReferences(contrib).indexOf(aff.id) >= 0) {
        selected.attr('checked', true)
      }
      el.append(
        $$('div').addClass('se-aff').append(
          selected,
          $$('span').append(stringAff.getText())
        )
      )
    })
    return el
  }

  _getAffReferences(contrib) {
    return contrib.getAttribute('aff-ids').split(' ')
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