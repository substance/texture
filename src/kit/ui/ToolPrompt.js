import ToolGroup from './ToolGroup'

// TODO: explain why this is necessary. Do we really need styles for this?
// Or could we just use 'group' within Overlay?
export default class ToolPrompt extends ToolGroup {
  _getClassNames () {
    return 'sc-tool-prompt'
  }
}
