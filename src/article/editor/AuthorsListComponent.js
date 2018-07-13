import ContribsListComponent from './ContribListComponent'

export default class AuthorsListComponent extends ContribsListComponent {
  getClassNames() {
    return 'sc-authors-list'
  }

  getTargetTypes() {
    return ['person']
  }

  getPropertyName() {
    return 'authors'
  }

  getEmptyMessage() {
    return this.getLabel('no-authors')
  }

}
