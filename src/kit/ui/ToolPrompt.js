import ToolGroup from './ToolGroup'

export default class ToolPrompt extends ToolGroup {
  _getClassNames () {
    return 'sc-tool-prompt'
  }

  get _isTopLevel () {
    return true
  }
}
