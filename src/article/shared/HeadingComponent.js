import { TextNodeComponent } from '../../kit'

export default class HeadingComponent extends TextNodeComponent {
  getTagName () {
    return 'h' + this.props.node.getLevel()
  }
}
