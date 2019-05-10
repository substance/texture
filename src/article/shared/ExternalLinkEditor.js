import { Component } from 'substance'

/**
 * Used in the popup when cursor is on an external-link.
 */
export default class ExternalLinkEditor extends Component {
  render ($$) {
    let TextPropertyEditor = this.getComponent('text-property-editor')
    let Button = this.getComponent('button')
    let el = $$('div').addClass('sc-external-link-editor').addClass('sm-horizontal-layout')
    let node = this.props.node

    let hrefEditor = $$(TextPropertyEditor, {
      path: [node.id, 'href'],
      placeholder: 'Paste or type a link url'
    }).ref('input')
      .addClass('se-href')
      .addClass('sm-monospace')

    let openLinkButton = $$(Button, {
      icon: 'open-link',
      theme: this.props.theme
    }).addClass('sm-open')
      .attr('title', this.getLabel('open-link'))
      .on('click', this._openLink)

    el.append(
      hrefEditor,
      openLinkButton
    )
    return el
  }

  _openLink () {
    let url = this.props.node.href
    // FIXME: this is not the way how it should be done
    // instead we should send up an action 'open-url'
    // and let the ApplicationChrome do it.
    window.open(url, '_blank')
  }
}
