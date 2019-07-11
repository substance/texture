import ArticleInformationSectionComponent from './ArticleInformationSectionComponent'
import ArticleMetadataComponent from './ArticleMetadataComponent'
import AbstractsSectionComponent from './AbstractsSectionComponent'
import FiguresSectionComponent from './FiguresSectionComponent'
import { AddAuthorCommand, AddCustomAbstractCommand } from './MetadataEntityCommands'

export default {
  name: 'metadata',
  configure (articleConfig) {
    let config = articleConfig.createSubConfiguration('metadata')

    // TODO: it would be greate to reuse config from the article toolbar.
    // However, this is problematic, because at the time of this being called
    // the article toolbar configuration might not have been finished.
    // E.g. a plugin could change it.
    let articleToolbarSpec = articleConfig._toolPanelRegistry.get('toolbar')
    config.addToolPanel('toolbar', [
      // only undo/redo, no save
      {
        name: 'document-tools',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'undo' },
          { type: 'command', name: 'redo' }
        ]
      },
      // inherit primary-annotations
      articleToolbarSpec.find(spec => spec.name === 'primary-annotations'),
      // only inline content and metadata content
      {
        name: 'insert',
        type: 'dropdown',
        style: 'descriptive',
        hideDisabled: true,
        alwaysVisible: true,
        items: [
          {
            name: 'metadata',
            type: 'group',
            label: 'entities',
            items: [
              { type: 'command', name: 'add-author', label: 'author' },
              { type: 'command', name: 'add-custom-abstract', label: 'custom-abstract' }
              // { type: 'command', name: 'insert-editor', label: 'editor' },
              // { type: 'command', name: 'insert-group', label: 'group' },
              // { type: 'command', name: 'insert-organisation', label: 'affiliation' },
              // { type: 'command', name: 'insert-funder', label: 'funder' },
              // { type: 'command', name: 'insert-keyword', label: 'keyword' },
              // { type: 'command', name: 'insert-subject', label: 'subject' }
            ]
          },
          {
            name: 'inline-content',
            type: 'group',
            label: 'inline',
            items: [
              { type: 'command', name: 'insert-inline-formula', label: 'math' },
              { type: 'command', name: 'insert-inline-graphic', label: 'inline-graphic' },
              { type: 'command', name: 'create-external-link', label: 'link', icon: 'link' },
              { type: 'command', name: 'insert-xref-bibr', label: 'citation' },
              { type: 'command', name: 'insert-xref-figure', label: 'figure-reference' },
              { type: 'command', name: 'insert-xref-table', label: 'table-reference' },
              { type: 'command', name: 'insert-xref-footnote', label: 'footnote-reference' },
              { type: 'command', name: 'insert-xref-formula', label: 'equation-reference' },
              { type: 'command', name: 'insert-xref-file', label: 'file-reference' }
            ]
          }
        ]
      },
      // inherit formatting
      articleToolbarSpec.find(spec => spec.name === 'format'),
      // inherit text type switcher
      articleToolbarSpec.find(spec => spec.name === 'text-types'),
      // inherit contextual tools
      articleToolbarSpec.find(spec => spec.name === 'context-tools')
    ])

    config.addToolPanel('context-menu', [
      {
        name: 'context-menu',
        type: 'group',
        style: 'descriptive',
        hideDisabled: true,
        items: [
          { type: 'command-group', name: 'file' },
          { type: 'command-group', name: 'author' },
          { type: 'command-group', name: 'collection' },
          { type: 'command-group', name: 'list' },
          { type: 'command-group', name: 'metadata-fields' }
        ]
      }
    ])

    config.addComponent('article-metadata', ArticleMetadataComponent)
    config.addComponent('article-information', ArticleInformationSectionComponent)
    config.addComponent('@abstracts', AbstractsSectionComponent)
    config.addComponent('@figures', FiguresSectionComponent)

    config.addCommand('add-author', AddAuthorCommand)
    config.addCommand('add-custom-abstract', AddCustomAbstractCommand)

    config.addLabel('abstracts', 'Abstracts')
    config.addLabel('article-information', 'Article Information')
    config.addLabel('article-metadata', 'Article Metadata')
    config.addLabel('groups', 'Groups')
    config.addLabel('issueTitle', 'Issue Title')
    config.addLabel('keywords', 'Keywords')
    config.addLabel('references', 'References')
    config.addLabel('subjects', 'Subjects')
    config.addLabel('organisations', 'Affiliations')

    config.addIcon('checked-item', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked-item', { 'fontawesome': 'fa-square-o' })
    config.addIcon('remove', { 'fontawesome': 'fa-trash' })
  }
}
