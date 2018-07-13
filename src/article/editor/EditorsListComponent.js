import ContribsListComponent from './ContribListComponent'

export default class EditorsListComponent extends ContribsListComponent {
  getClassNames() {
    return 'sc-authors-list'
  }

  getTargetTypes() {
    return ['person']
  }

  getPropertyName() {
    return 'editors'
  }

  getEmptyMessage() {
    return this.getLabel('no-editors')
  }
}
