import { Component } from 'substance'

export default class ManuscriptComponent extends Component {
  render ($$) {
    const AuthorsListComponent = this.getComponent('authors-list')
    const SectionLabel = this.getComponent('section-label')
    const model = this.props.model
    const frontModel = model.getPropertyValue('front')
    const bodyModel = model.getPropertyValue('body')
    const backModel = model.getPropertyValue('back')
    const titleModel = frontModel.getPropertyValue('title')
    const authorsModel = frontModel.getPropertyValue('authors')
    const abstractModel = frontModel.getPropertyValue('abstract')
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
      })
    )

    if (authorsModel.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'authors-label'}),
        $$(AuthorsListComponent, {
          model: authorsModel,
          placeholder: this.getLabel('authors-placeholder')
        })
      )
    }

    el.append(
      $$(SectionLabel, {label: 'abstract-label'}),
      $$(AbstractComponent, {
        model: abstractModel,
        placeholder: this.getLabel('abstract-placeholder')
      }),
      $$(SectionLabel, {label: 'body-label'}),
      $$(BodyComponent, {
        model: bodyModel,
        placeholder: this.getLabel('body-placeholder')
      })
    )

    if (footnotesModel.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'footnotes-label'}),
        $$(FootnotesListComponent, {
          model: footnotesModel
        })
      )
    }

    if (referencesModel.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'references-label'}),
        $$(ReferenceListComponent, {
          model: referencesModel
        })
      )
    }

    return el
  }

  getClassNames () {
    return 'sc-manuscript'
  }

  _getPropertyComponent (property) {
    return this.getComponent(property.type)
  }
}
