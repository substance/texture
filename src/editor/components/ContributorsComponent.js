import { NodeComponent } from 'substance'
import MetadataSection from './MetadataSection'

/*
  Edit affiliations for a publication in this MetadataSection
*/
export default class ContributorsComponent extends NodeComponent {

  getInitialState() {
    return {
      expanded: true
    }
  }

  render($$) {
    const contribGroup = this.props.node
    const doc = contribGroup.getDocument()

    let el = $$('div').addClass('sc-affiliations')

    el.append(
      $$(MetadataSection, {
        label: 'Contributors',
        expanded: this.state.expanded
      }).on('click', this._toggle)
    )

    if (this.state.expanded) {
      let affs = doc.findAll('article-meta > aff-group > aff')
      contribGroup.getChildren().forEach((contrib) => {
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
    const PlainText = this.getComponent('plain-text-property')
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
          $$(PlainText, { path: stringAff.getTextPath() })
        )
      )
    })
    return el
  }

  _getAffReferences(contrib) {
    let attrIds = contrib.getAttribute('aff-ids') || ''
    return attrIds.split(' ')
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  _addContributor() {
    const nodeId = this.props.node.id
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let contribGroup = doc.get(nodeId)
      let contrib = doc.createElement('contrib').attr('aff-type', 'foo')
      contrib.append(
        doc.createElement('string-contrib')
      )
      contribGroup.append(contrib)
    })
  }

}