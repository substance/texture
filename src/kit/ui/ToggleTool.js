import Tool from './Tool'

/**
 * @param {string} props.style
 * @param {string} props.theme
 * @param {object} props.item
 * @param {object} props.commandState
 */
export default class ToggleTool extends Tool {
  getClassNames () {
    return `sc-toggle-tool sc-tool sm-${this.props.item.name}`
  }
}
