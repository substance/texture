import TextNodeComponent from './TextNodeComponent'

export default
class HeadingComponent extends TextNodeComponent {

  getLevel() {
    return this.props.node.attributes['level'] || 1
  }

  getTagName() {
    return 'h'+this.getLevel()
  }
}