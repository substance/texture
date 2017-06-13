import TextNodeComponent from './TextNodeComponent'

export default
class HeadingComponent extends TextNodeComponent {

  getLevel() {
    return parseInt(this.props.node.level, 10) || 1
  }

  getTagName() {
    return 'h'+this.getLevel()
  }
}