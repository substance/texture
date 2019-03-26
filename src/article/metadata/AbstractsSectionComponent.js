import MetadataCollectionComponent from './MetadataCollectionComponent'

export default class AbstractsSectionComponent extends MetadataCollectionComponent {
  didMount () {
    let path = this.props.model.getPath()
    this.context.appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: { path }
    })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }
}
