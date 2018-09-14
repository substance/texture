import { CompositeComponent } from '../../kit'

export default class ManuscriptComponent extends CompositeComponent {
  getClassNames () {
    return 'sc-manuscript'
  }

  _getPropertyComponent (property) {
    switch (property.name) {
      case 'body':
        return this.getComponent('body')
      default:
        return super._getPropertyComponent(property)
    }
  }
}
