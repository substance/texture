import { Component } from 'substance'
import { renderModel } from '../../kit'
import ManuscriptSection from '../editor/ManuscriptSection'

export default class ManuscriptComponent extends Component {
  render ($$) {
    const manuscript = this.props.model
    const AuthorsListComponent = this.getComponent('authors-list')
    const ReferenceListComponent = this.getComponent('reference-list')

    let el = $$('div').addClass('sc-manuscript')

    // TODO: maybe we want to be able to configure if a section should be hidden when empty

    // Title
    let titleModel = manuscript.getTitle()
    el.append(
      $$(ManuscriptSection, {
        name: 'title',
        label: this.getLabel('title-label'),
        model: titleModel
      }).ref('titleSection').append(
        renderModel($$, this, titleModel, {
          placeholder: this.getLabel('title-placeholder')
        }).ref('title').addClass('sm-title')
      )
    )
    // Sub-title
    let subTitleModel = manuscript.getSubTitle()
    el.append(
      $$(ManuscriptSection, {
        name: 'subtitle',
        label: this.getLabel('subtitle-label'),
        model: subTitleModel
      }).ref('subtitleSection').append(
        renderModel($$, this, subTitleModel, {
          placeholder: this.getLabel('subtitle-placeholder')
        }).ref('subTitle').addClass('sm-subtitle')
      )
    )
    // Authors
    let authorsModel = manuscript.getAuthors()
    el.append(
      $$(ManuscriptSection, {
        name: 'authors',
        label: this.getLabel('authors-label'),
        model: authorsModel,
        hideWhenEmpty: true
      }).ref('authorsSection').append(
        $$(AuthorsListComponent, {
          model: authorsModel,
          placeholder: this.getLabel('authors-placeholder')
        }).ref('authors').addClass('sm-authors')
      )
    )
    // Abstract
    let abstractModel = manuscript.getAbstract()
    el.append(
      $$(ManuscriptSection, {
        name: 'abstract',
        label: this.getLabel('abstract-label'),
        model: abstractModel
      }).ref('abstractSection').append(
        renderModel($$, this, abstractModel, {
          name: 'abstract',
          placeholder: this.getLabel('abstract-placeholder')
        }).ref('abstract').addClass('sm-abstract')
      )
    )
    // Body
    let bodyModel = manuscript.getBody()
    el.append(
      $$(ManuscriptSection, {
        name: 'body',
        label: this.getLabel('body-label'),
        model: bodyModel
      }).ref('bodySection').append(
        renderModel($$, this, bodyModel, {
          name: 'body',
          placeholder: this.getLabel('body-placeholder')
        }).ref('body').addClass('sm-body')
      )
    )
    // Footnotes
    let footnotesModel = manuscript.getFootnotes()
    el.append(
      $$(ManuscriptSection, {
        name: 'footnotes',
        label: this.getLabel('footnotes-label'),
        model: footnotesModel,
        hideWhenEmpty: true
      }).ref('footnotesSection').append(
        renderModel($$, this, footnotesModel).ref('footnotes').addClass('sm-footnotes')
      )
    )
    // References
    let referencesModel = manuscript.getReferences()
    el.append(
      $$(ManuscriptSection, {
        name: 'references',
        label: this.getLabel('references-label'),
        model: referencesModel,
        hideWhenEmpty: true
      }).ref('referencesSection').append(
        $$(ReferenceListComponent, {
          model: referencesModel
        }).ref('references').addClass('sm-references')
      )
    )

    return el
  }
}
