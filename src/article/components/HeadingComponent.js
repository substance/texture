import { TextNodeComponent } from '../../kit'

export default class HeadingComponent extends TextNodeComponent {
  didMount () {
    this.context.appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: { path: [this.props.node.id] }
    })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  getClassNames () {
    return 'sc-heading sc-text-node'
  }

  getTagName () {
    return 'h' + this.props.node.level
  }
}
