import {
  BasePackage, EditorBasePackage, ModelComponentPackage, FindAndReplacePackage
} from '../../kit'

import ArticleNavPackage from '../ArticleNavPackage'
import PersistencePackage from '../../PersistencePackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'

import AddReferenceWorkflow from '../shared/AddReferenceWorkflow'
import AddEntityCommand from './AddEntityCommand'
import InsertFootnoteCommand from '../shared/InsertFootnoteCommand'
import { MoveCollectionItemCommand, RemoveCollectionItemCommand } from './CollectionCommands'
import {
  AddFigurePanelCommand, MoveFigurePanelCommand,
  ReplaceFigurePanelImageCommand, RemoveFigurePanelCommand
} from '../shared/FigurePanelCommands'
import UploadFigurePanelTool from '../shared/UploadFigurePanelTool'
import CollectionEditor from './CollectionEditor'
import ArticleRecordEditor from './ArticleRecordEditor'
import BibliographicEntryEditor from './BibliographicEntryEditor'
import TranslatableEntryEditor from './TranslatableEntryEditor'
import TranslateableEditor from './TranslateableEditor'

import TableFigureComponent from '../shared/TableFigureComponent'
import FiguresSectionComponent from './FiguresSectionComponent'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ArticleNavPackage)
    config.import(PersistencePackage)
    config.import(ManuscriptContentPackage)
    config.import(ModelComponentPackage)
    config.import(EntityLabelsPackage)
    config.import(FindAndReplacePackage)

    // sections and editors
    config.addComponent('collection', CollectionEditor)
    config.addComponent('article-record', ArticleRecordEditor)
    config.addComponent('bibr', BibliographicEntryEditor, true)
    config.addComponent('table-figure', TableFigureComponent, true)
    config.addComponent('subject', TranslatableEntryEditor)
    config.addComponent('translatable', TranslateableEditor)
    config.addComponent('keyword', TranslatableEntryEditor)
    config.addComponent('figures', FiguresSectionComponent)

    // workflows
    config.addComponent('add-reference', AddReferenceWorkflow)

    config.addToolPanel('toolbar', [
      {
        name: 'undo-redo',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'undo-redo' }
        ]
      },
      {
        name: 'persistence',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'persistence' }
        ]
      },
      {
        name: 'add',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'add-entity' }
        ]
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'formatting' }
        ]
      },
      {
        name: 'collection-tools',
        type: 'tool-group',
        showDisabled: false,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'collection' }
        ]
      },
      {
        name: 'mode',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'full',
        items: [
          { type: 'command-group', name: 'switch-view' }
        ]
      }
      // TODO: enable this when we have a first workflow
      // which does not belong to the add-entity group
      // {
      //   name: 'workflows',
      //   type: 'tool-dropdown',
      //   showDisabled: true,
      //   style: 'descriptive',
      //   items: [
      //     { type: 'command-group', name: 'workflows' }
      //   ]
      // }
    ])
    config.addLabel('article-record', {
      en: 'Article Information'
    })

    config.addLabel('add', {
      en: 'Add'
    })
    config.addLabel('edit', {
      en: 'Edit'
    })
    config.addLabel('remove', {
      en: 'Remove'
    })
    config.addLabel('workflows', {
      en: 'Workflows'
    })

    config.addIcon('remove', {
      'fontawesome': 'fa-trash'
    })

    config.addCommand('add-author', AddEntityCommand, {
      type: 'author',
      collection: 'authors',
      commandGroup: 'add-entity'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+A', { command: 'add-author' })

    config.addCommand('add-editor', AddEntityCommand, {
      type: 'editor',
      collection: 'editors',
      commandGroup: 'add-entity'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+E', { command: 'add-editor' })

    config.addCommand('add-group', AddEntityCommand, {
      type: 'group',
      collection: 'groups',
      commandGroup: 'add-entity'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+G', { command: 'add-group' })

    config.addCommand('add-organisation', AddEntityCommand, {
      type: 'organisation',
      collection: 'organisations',
      commandGroup: 'add-entity'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+O', { command: 'add-organisation' })

    config.addCommand('add-award', AddEntityCommand, {
      type: 'award',
      collection: 'awards',
      commandGroup: 'add-entity'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Y', { command: 'add-award' })

    config.addCommand('add-keyword', AddEntityCommand, {
      type: 'keyword',
      collection: 'keywords',
      commandGroup: 'add-entity'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+K', { command: 'add-keyword' })

    config.addCommand('add-subject', AddEntityCommand, {
      type: 'subject',
      collection: 'subjects',
      commandGroup: 'add-entity'
    })

    config.addCommand('add-footnote', InsertFootnoteCommand, {
      commandGroup: 'add-entity'
    })

    config.addCommand('add-figure-panel', AddFigurePanelCommand, {
      commandGroup: 'collection'
    })
    config.addTool('add-figure-panel', UploadFigurePanelTool)
    config.addLabel('add-figure-panel', 'Add Sub-Figure')
    config.addIcon('add-figure-panel', { 'fontawesome': 'fa-upload' })

    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand, {
      commandGroup: 'collection'
    })
    config.addTool('replace-figure-panel-image', UploadFigurePanelTool)
    config.addLabel('replace-figure-panel-image', 'Replace Sub-Figure Image')
    config.addIcon('replace-figure-panel-image', { 'fontawesome': 'fa-file-image-o' })

    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'collection'
    })
    config.addLabel('remove-figure-panel', 'Remove Sub-Figure')
    config.addIcon('remove-figure-panel', { 'fontawesome': 'fa-trash' })

    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'collection'
    })
    config.addLabel('move-up-figure-panel', 'Move Up Sub-Figure')
    config.addIcon('move-up-figure-panel', { 'fontawesome': 'fa-caret-square-o-up' })

    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'collection'
    })
    config.addLabel('move-down-figure-panel', 'Move Down Sub-Figure')
    config.addIcon('move-down-figure-panel', { 'fontawesome': 'fa-caret-square-o-down' })

    config.addLabel('add-reference', {
      en: 'Reference'
    })
    config.addLabel('add-author', {
      en: 'Author'
    })
    config.addLabel('add-editor', {
      en: 'Editor'
    })
    config.addLabel('add-group', {
      en: 'Group'
    })
    config.addLabel('add-organisation', {
      en: 'Affiliation'
    })
    config.addLabel('add-award', {
      en: 'Award'
    })
    config.addLabel('add-keyword', {
      en: 'Keyword'
    })
    config.addLabel('add-subject', {
      en: 'Subject'
    })
    config.addLabel('add-footnote', {
      en: 'Footnote'
    })
    config.addLabel('original-translation', {
      en: 'Original'
    })
    config.addLabel('add-translation', {
      en: 'Add Translation'
    })
    config.addLabel('select-language', {
      en: 'Select language'
    })

    config.addLabel('title-trans', {
      en: 'Title'
    })
    config.addLabel('abstract-trans', {
      en: 'Abstract'
    })

    config.addLabel('select-license', {
      en: 'Select license'
    })

    // TODO: we should try to extract these into a package and share with ManuscriptEditor
    config.addAnnotationTool({
      name: 'bold',
      nodeType: 'bold',
      commandGroup: 'formatting',
      icon: 'fa-bold',
      label: 'Strong',
      accelerator: 'CommandOrControl+B'
    })

    config.addAnnotationTool({
      name: 'italic',
      nodeType: 'italic',
      commandGroup: 'formatting',
      icon: 'fa-italic',
      label: 'Emphasize',
      accelerator: 'CommandOrControl+I'
    })

    config.addAnnotationTool({
      name: 'sub',
      nodeType: 'sub',
      commandGroup: 'formatting',
      icon: 'fa-subscript',
      label: 'Subscript'
    })

    config.addAnnotationTool({
      name: 'sup',
      nodeType: 'sup',
      commandGroup: 'formatting',
      icon: 'fa-superscript',
      label: 'Superscript'
    })

    config.addAnnotationTool({
      name: 'monospace',
      nodeType: 'monospace',
      commandGroup: 'formatting',
      icon: 'fa-code',
      label: 'Monospace'
    })

    // Section labels
    config.addLabel('article', {
      en: 'Article Information'
    })
    config.addLabel('authors', {
      en: 'Authors'
    })
    config.addLabel('figures', {
      en: 'Figures'
    })
    config.addLabel('footnotes', {
      en: 'Footnotes'
    })
    config.addLabel('groups', {
      en: 'Groups'
    })
    config.addLabel('keywords', {
      en: 'Keywords'
    })
    config.addLabel('subjects', {
      en: 'Subjects'
    })
    config.addLabel('organisations', {
      en: 'Affiliations'
    })
    config.addLabel('references', {
      en: 'References'
    })
    config.addLabel('tables', {
      en: 'Tables'
    })
    config.addLabel('translateables', {
      en: 'Translations'
    })
    config.addLabel('translations', {
      en: 'Translations'
    })
    config.addLabel('title-trans', {
      en: 'Title'
    })
    config.addLabel('abstract-trans', {
      en: 'Abstract'
    })

    // Workflows
    config.addCommand('add-reference', AddEntityCommand, {
      workflow: 'add-reference',
      commandGroup: 'add-entity',
      type: 'bibr',
      collection: 'references'
    })
    config.addKeyboardShortcut('CommandOrControl+Shift+L', { command: 'add-reference' })
    config.addLabel('add-reference', {
      en: 'Reference'
    })

    // Add reference workflow
    config.addLabel('add-reference-title', {
      en: 'Add Reference(s)'
    })
    config.addLabel('add-ref-manually', {
      en: 'Or create manually'
    })
    config.addLabel('fetch-datacite', {
      en: 'Fetch from DataCite'
    })
    config.addLabel('enter-doi-placeholder', {
      en: 'Enter one or more DOIs'
    })
    config.addLabel('doi-fetch-action', {
      en: 'Add'
    })
    config.addLabel('import-refs', {
      en: 'Import'
    })
    config.addLabel('supported-ref-formats', {
      en: 'Supported formats'
    })

    // Card tools
    config.addCommand('move-up-col-item', MoveCollectionItemCommand, {
      direction: 'up',
      commandGroup: 'collection'
    })
    config.addIcon('move-up-col-item', { 'fontawesome': 'fa-caret-square-o-up' })
    config.addLabel('move-up-col-item', {
      en: 'Move item up'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Up', { command: 'move-up-col-item' })
    config.addCommand('move-down-col-item', MoveCollectionItemCommand, {
      direction: 'down',
      commandGroup: 'collection'
    })
    config.addIcon('move-down-col-item', { 'fontawesome': 'fa-caret-square-o-down' })
    config.addLabel('move-down-col-item', {
      en: 'Move item down'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Down', { command: 'move-down-col-item' })
    config.addCommand('remove-col-item', RemoveCollectionItemCommand, {
      commandGroup: 'collection'
    })
    config.addIcon('remove-col-item', { 'fontawesome': 'fa-trash' })
    config.addLabel('remove-col-item', {
      en: 'Remove item'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Delete', { command: 'remove-col-item' })

    config.addIcon('checked-item', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked-item', { 'fontawesome': 'fa-square-o' })
    config.addLabel('select-item', {
      en: 'Choose'
    })
  }
}
