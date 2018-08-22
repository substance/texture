import { CompositeComponent } from '../../kit'

export default class FrontMatterComponent extends CompositeComponent {
  getClassNames () {
    return 'sc-front-matter'
  }

  _getPropertyComponent (property) {
    // don't use the regular card based collection component for authors
    // only a display
    switch (property.name) {
      case 'authors':
        return this.getComponent('authors-list')
      case 'abstract':
        return this.getComponent('abstract')
      default:
        return super._getPropertyComponent(property)
    }
  }
}
