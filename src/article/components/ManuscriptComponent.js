import { Component, $$ } from 'substance'
import { renderProperty, HideIfEmpty } from '../../kit'
import ManuscriptSection from './ManuscriptSection'

export default class ManuscriptComponent extends Component {
  render () {
    const document = this.context.editorState.document

    const AuthorsListComponent = this.getComponent('authors-list')
    const ReferenceListComponent = this.getComponent('reference-list')

    let el = $$('div').addClass('sc-manuscript')

    // Title
    el.append(
      $$(ManuscriptSection, { name: 'title', label: this.getLabel('title-label') },
        renderProperty(this, document, ['article', 'title'], {
          placeholder: this.getLabel('title-placeholder')
        }).addClass('sm-title')
      )
    )
    // Sub-title
    el.append(
      $$(ManuscriptSection, { name: 'subtitle', label: this.getLabel('subtitle-label') },
        renderProperty(this, document, ['article', 'subTitle'], {
          placeholder: this.getLabel('subtitle-placeholder')
        }).addClass('sm-subtitle')
      )
    )
    // Authors
    const authorsPath = ['metadata', 'authors']
    el.append(
      $$(HideIfEmpty, { document, path: authorsPath },
        $$(ManuscriptSection, { name: 'authors', label: this.getLabel('authors-label') },
          $$(AuthorsListComponent, {
            path: authorsPath
          }).addClass('sm-authors')
        )
      )
    )
    // Abstract
    const abstract = document.resolve(['article', 'abstract'])
    el.append(
      $$(ManuscriptSection, { name: 'abstract', label: this.getLabel('abstract-label') },
        renderProperty(this, document, [abstract.id, 'content'], {
          name: 'abstract',
          placeholder: this.getLabel('abstract-placeholder')
        }).addClass('sm-abstract')
      )
    )
    // Body
    el.append(
      $$(ManuscriptSection, { name: 'body', label: this.getLabel('body-label') }).append(
        renderProperty(this, document, ['body', 'content'], {
          name: 'body',
          placeholder: this.getLabel('body-placeholder')
        }).addClass('sm-body')
      )
    )
    // Footnotes
    const footnotesPath = ['article', 'footnotes']
    el.append(
      $$(HideIfEmpty, { document, path: footnotesPath },
        $$(ManuscriptSection, { name: 'footnotes', label: this.getLabel('footnotes-label') },
          renderProperty(this, document, ['article', 'footnotes']).addClass('sm-footnotes')
        )
      )
    )
    // References
    const referencesPath = ['article', 'references']
    el.append(
      $$(HideIfEmpty, { document, path: referencesPath },
        $$(ManuscriptSection, { name: 'references', label: this.getLabel('references-label') },
          $$(ReferenceListComponent, {
            path: referencesPath
          }).addClass('sm-references')
        )
      )
    )

    return el
  }
}
