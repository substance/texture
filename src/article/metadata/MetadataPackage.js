/* eslint-disable no-template-curly-in-string */
import { CustomAbstract } from '../nodes'
import ArticleInformationSectionComponent from './ArticleInformationSectionComponent'
import ArticleMetadataComponent from './ArticleMetadataComponent'
import AbstractsSectionComponent from './AbstractsSectionComponent'
import FiguresSectionComponent from './FiguresSectionComponent'
import {
  AddAffiliationCommand, AddAuthorCommand, AddCustomAbstractCommand, RemoveEntityCommand,
  MoveEntityUpCommand, MoveEntityDownCommand, AddEditorCommand,
  AddGroupCommand, AddFunderCommand, AddKeywordCommand,
  AddSubjectCommand
} from './MetadataEntityCommands'
import CustomAbstractComponent from './CustomAbstractComponent'

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
              { type: 'command', name: 'add-custom-abstract', label: 'custom-abstract' },
              { type: 'command', name: 'add-editor', label: 'editor' },
              { type: 'command', name: 'add-group', label: 'group' },
              { type: 'command', name: 'add-affiliation', label: 'affiliation' },
              { type: 'command', name: 'add-funder', label: 'funder' },
              { type: 'command', name: 'add-keyword', label: 'keyword' },
              { type: 'command', name: 'add-subject', label: 'subject' }
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
      // inherit contextual tools, but exclude the 'Edit Metadata' tool
      {
        name: 'context-tools',
        type: 'dropdown',
        style: 'descriptive',
        // hide disabled items but not the dropdown itself
        hideDisabled: true,
        alwaysVisible: true,
        items: articleToolbarSpec.find(spec => spec.name === 'context-tools').items.filter(s => s.name !== 'edit-metadata')
      }
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
    config.addComponent(CustomAbstract.type, CustomAbstractComponent)
    config.addComponent('@abstracts', AbstractsSectionComponent)
    config.addComponent('@figures', FiguresSectionComponent)

    config.addCommand('add-author', AddAuthorCommand)
    config.addCommand('add-affiliation', AddAffiliationCommand)
    config.addCommand('add-custom-abstract', AddCustomAbstractCommand)
    config.addCommand('add-editor', AddEditorCommand)
    config.addCommand('add-group', AddGroupCommand)
    config.addCommand('add-funder', AddFunderCommand)
    config.addCommand('add-keyword', AddKeywordCommand)
    config.addCommand('add-subject', AddSubjectCommand)

    config.addCommand('remove-entity', RemoveEntityCommand, {
      commandGroup: 'collection'
    })
    config.addCommand('move-entity-down', MoveEntityDownCommand, {
      commandGroup: 'collection'
    })
    config.addCommand('move-entity-up', MoveEntityUpCommand, {
      commandGroup: 'collection'
    })

    config.addLabel('abstracts', 'Abstracts')
    config.addLabel('article-information', 'Article Information')
    config.addLabel('article-metadata', 'Article Metadata')
    config.addLabel('groups', 'Groups')
    config.addLabel('issueTitle', 'Issue Title')
    config.addLabel('keywords', 'Keywords')
    config.addLabel('affiliations', 'Affiliations')
    config.addLabel('references', 'References')
    config.addLabel('remove-entity', '${label}') // NOTE: the command itself has to provide 'label' via commandState
    config.addLabel('move-entity-down', '${label}') // NOTE: the command itself has to provide 'label' via commandState
    config.addLabel('move-entity-up', '${label}') // NOTE: the command itself has to provide 'label' via commandState
    config.addLabel('remove-something', 'Remove ${something}')
    config.addLabel('move-something-down', 'Move ${something} down')
    config.addLabel('move-something-up', 'Move ${something} up')
    config.addLabel('subjects', 'Subjects')

    config.addIcon('checked-item', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked-item', { 'fontawesome': 'fa-square-o' })
    config.addIcon('remove', { 'fontawesome': 'fa-trash' })
  }
}
