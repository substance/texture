import { TextNodeComponent } from '../../kit'

export default class HeadingComponent extends TextNodeComponent {
  getClassNames () {
    return 'sc-heading sc-text-node'
  }

  getTagName () {
    return 'h' + this.props.node.level
  }
}
