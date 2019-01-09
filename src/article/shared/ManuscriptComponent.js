import { Component } from 'substance'
import { renderModel } from '../../kit'

export default class ManuscriptComponent extends Component {
  render ($$) {
    const manuscript = this.props.model

    const SectionLabel = this.getComponent('section-label')
    const AuthorsListComponent = this.getComponent('authors-list')
    const ReferenceListComponent = this.getComponent('reference-list')

    let el = $$('div').addClass('sc-manuscript').append(
      $$(SectionLabel, { label: 'title-label' }).addClass('sm-title'),
      renderModel($$, this, manuscript.getTitle()).addClass('sm-title').ref('title')
    )

    // TODO: we need to think about a way to configure what should be displayed
    if (manuscript.hasAuthors()) {
      el.append(
        $$(SectionLabel, {label: 'authors-label'}).addClass('sm-authors'),
        $$(AuthorsListComponent, {
          model: manuscript.getAuthors(),
          placeholder: this.getLabel('authors-placeholder')
        }).ref('authors').addClass('sm-authors')
      )
    }

    el.append(
      $$(SectionLabel, {label: 'abstract-label'}).addClass('sm-abstract'),
      renderModel($$, this, manuscript.getAbstract(), {
        container: true,
        name: 'abstract',
        placeholder: this.getLabel('abstract-placeholder')
      }).addClass('sm-abstract').ref('abstract')
    )

    el.append(
      $$(SectionLabel, {label: 'body-label'}).addClass('sm-body'),
      renderModel($$, this, manuscript.getBody(), {
        container: true,
        name: 'body',
        placeholder: this.getLabel('body-placeholder')
      }).addClass('sm-body').ref('body')
    )

    if (manuscript.hasFootnotes()) {
      el.append(
        $$(SectionLabel, {label: 'footnotes-label'}).addClass('sm-footnotes'),
        renderModel($$, this, manuscript.getFootnotes()).ref('footnotes').addClass('sm-footnotes')
      )
    }

    if (manuscript.hasReferences()) {
      el.append(
        $$(SectionLabel, {label: 'references-label'}).addClass('sm-references'),
        $$(ReferenceListComponent, {
          model: manuscript.getReferences()
        }).ref('references').addClass('sm-references')
      )
    }

    return el
  }
}
