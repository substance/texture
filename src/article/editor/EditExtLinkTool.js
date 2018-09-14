import { ToggleTool } from '../../kit'

export default class EditExtLinkTool extends ToggleTool {
  render ($$) {
    let Input = this.getComponent('input')
    let Button = this.getComponent('button')
    let commandState = this.props.commandState
    let el = $$('div').addClass('sc-edit-ext-link-tool')

    // GUARD: Return if tool is disabled
    if (commandState.disabled) {
      console.warn('Tried to render EditLinkTool while disabled.')
      return el
    }

    let urlPath = this._getUrlPath()

    el.append(
      $$(Input, {
        type: 'url',
        path: urlPath,
        placeholder: 'Paste or type a link url'
      }).ref('input'),
      $$(Button, {
        icon: 'open-link',
        theme: this.props.theme
      }).addClass('sm-open')
        .attr('title', this.getLabel('open-link'))
        .on('click', this._openLink)
    )
    return el
  }

  _getPropPath () {
    return ['attributes', 'xlink:href']
  }

  _getUrlPath () {
    const nodeId = this._getNodeId()
    let propPath = this._getPropPath()
    return [nodeId].concat(propPath)
  }

  _getNodeId () {
    return this.props.commandState.nodeId
  }

  _openLink () {
    let doc = this._getDocument()
    let url = doc.get(this._getUrlPath())
    window.open(url, '_blank')
  }

  _getDocument () {
    return this.context.editorSession.getDocument()
  }
}
