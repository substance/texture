import Tool from './Tool'

export default class MenuItem extends Tool {
  getClassNames () {
    return `sc-menu-item sm-${this.props.item.name}`
  }
}
