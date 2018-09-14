import { Component } from 'substance'

export default class ManuscriptComponent extends Component {
  render ($$) {
    const AuthorsListComponent = this.getComponent('authors-list')
    const SectionLabel = this.getComponent('section-label')
    const model = this.props.model
    const frontModel = model.getPropertyValue('front')
    const backModel = model.getPropertyValue('back')
    const titleModel = frontModel.getPropertyValue('title')
    const abstractModel = frontModel.getPropertyValue('abstract')
    const bodyModel = frontModel.getPropertyValue('abstract')
    const footnotesModel = backModel.getPropertyValue('footnotes')
    const referencesModel = backModel.getPropertyValue('references')
    const TitleComponent = this._getPropertyComponent(titleModel)
    const AbstractComponent = this._getPropertyComponent(abstractModel)
    const BodyComponent = this._getPropertyComponent(bodyModel)
    const FootnotesListComponent = this._getPropertyComponent(footnotesModel)
    const ReferenceListComponent = this._getPropertyComponent(referencesModel)

    let el = $$('div').addClass('sc-manuscript').append(
      $$(SectionLabel, {label: 'title-label'}),
      $$(TitleComponent, {
        model: titleModel,
        placeholder: this.getLabel('title-placeholder')
      }),
      $$(SectionLabel, {label: 'authors-label'}),
      $$(AuthorsListComponent, {
        model: frontModel.getPropertyValue('authors'),
        placeholder: this.getLabel('authors-placeholder')
      }),
      $$(SectionLabel, {label: 'abstract-label'}),
      $$(AbstractComponent, {
        model: frontModel.getPropertyValue('abstract'),
        placeholder: this.getLabel('abstract-placeholder')
      }),
      $$(SectionLabel, {label: 'body-label'}),
      $$(BodyComponent, {
        model: model.getPropertyValue('body'),
        placeholder: this.getLabel('body-placeholder')
      }),
      $$(SectionLabel, {label: 'footnotes-label'}),
      $$(FootnotesListComponent, {
        model: footnotesModel
      }),
      $$(SectionLabel, {label: 'references-label'}),
      $$(ReferenceListComponent, {
        model: referencesModel
      })
    )

    return el
  }

  getClassNames () {
    return 'sc-manuscript'
  }

  _getPropertyComponent (property) {
    return this.getComponent(property.type)
  }
}
