import { AnnotationCommand, EditAnnotationCommand, getKeyForPath } from 'substance'
import {
  BasePackage, EditorBasePackage, ModelComponentPackage, FindAndReplacePackage
} from '../../kit'

import ArticleToolbarPackage from '../shared/ArticleToolbarPackage'
import PersistencePackage from '../../PersistencePackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'

import AbstractsSectionComponent from './AbstractsSectionComponent'
import AddReferenceWorkflow from '../shared/AddReferenceWorkflow'
import AddEntityCommand from '../shared/AddEntityCommand'
import ArticleInformationSectionComponent from './ArticleInformationSectionComponent'
import ArticleMetadataComponent from './ArticleMetadataComponent'
import BibliographicEntryEditor from './BibliographicEntryEditor'
import CustomAbstractComponent from './CustomAbstractComponent'
import { MoveCollectionItemCommand, RemoveCollectionItemCommand } from './CollectionCommands'
import {
  AddFigurePanelCommand, MoveFigurePanelCommand,
  ReplaceFigurePanelImageCommand, RemoveFigurePanelCommand, OpenFigurePanelImageCommand
} from '../shared/FigurePanelCommands'
import EditEntityCommand from '../shared/EditEntityCommand'
import EditExtLinkTool from '../shared/EditExtLinkTool'
import EditXrefCommand from '../shared/EditXrefCommand'
import EditXrefTool from '../shared/EditXrefTool'
import FiguresSectionComponent from './FiguresSectionComponent'
import InsertCrossReferenceCommand from '../shared/InsertCrossReferenceCommand'
import InsertCustomAbstractCommand from '../shared/InsertCustomAbstractCommand'
import InsertExtLinkCommand from '../shared/InsertExtLinkCommand'
import InsertFigurePanelTool from '../shared/InsertFigurePanelTool'
import InsertFootnoteCommand from '../shared/InsertFootnoteCommand'
import InsertFootnoteCrossReferenceCommand from '../shared/InsertFootnoteCrossReferenceCommand'
import {
  InsertTableCommand, InsertCellsCommand, DeleteCellsCommand,
  TableSelectAllCommand, ToggleCellHeadingCommand, ToggleCellMergeCommand
} from '../editor/TableCommands'
import OpenFigurePanelImageTool from '../shared/OpenFigurePanelImageTool'
import ReplaceFigurePanelTool from '../shared/ReplaceFigurePanelTool'
import TableFigureComponent from '../shared/TableFigureComponent'
import TranslatableEntryEditor from './TranslatableEntryEditor'
import {
  AddCustomMetadataFieldCommand, MoveCustomMetadataFieldCommand, RemoveCustomMetadataFieldCommand
} from '../shared/CustomMetadataFieldCommands'
import RemoveReferenceCommand from './RemoveReferenceCommand'
import RemoveItemCommand from '../shared/RemoveItemCommand'
import SwitchViewCommand from '../shared/SwitchViewCommand'
import { BlockFormula, Figure, Reference, SupplementaryFile, Table } from '../models'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ArticleToolbarPackage)
    config.import(PersistencePackage)
    config.import(ManuscriptContentPackage)
    config.import(ModelComponentPackage)
    config.import(EntityLabelsPackage)
    config.import(FindAndReplacePackage)

    config.addComponent('add-reference', AddReferenceWorkflow)
    config.addComponent('article-metadata', ArticleMetadataComponent)
    config.addComponent('article-information', ArticleInformationSectionComponent)
    config.addComponent('custom-abstract', CustomAbstractComponent)
    config.addComponent('bibr', BibliographicEntryEditor, true)
    config.addComponent('table-figure', TableFigureComponent, true)
    config.addComponent('subject', TranslatableEntryEditor)
    config.addComponent('keyword', TranslatableEntryEditor)
    // Note: @figures and @tables are (dynamic) collections derived from the article's content
    config.addComponent('@abstracts', AbstractsSectionComponent)
    config.addComponent('@figures', FiguresSectionComponent)

    // SwitchTextTypes
    config.addTextTypeTool({
      name: 'switch-to-heading1',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        level: 1
      },
      icon: 'fa-header',
      label: 'Heading 1',
      accelerator: 'CommandOrControl+Alt+1'
    })
    config.addTextTypeTool({
      name: 'switch-to-heading2',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        level: 2
      },
      icon: 'fa-header',
      label: 'Heading 2',
      accelerator: 'CommandOrControl+Alt+2'
    })
    config.addTextTypeTool({
      name: 'switch-to-heading3',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        level: 3
      },
      icon: 'fa-header',
      label: 'Heading 3',
      accelerator: 'CommandOrControl+Alt+3'
    })
    config.addTextTypeTool({
      name: 'switch-to-paragraph',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'paragraph'
      },
      icon: 'fa-paragraph',
      label: 'Paragraph',
      accelerator: 'CommandOrControl+Alt+0'
    })
    // Commands
    config.addCommand('add-metadata-field', AddCustomMetadataFieldCommand, {
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('add-figure-panel', AddFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('create-external-link', InsertExtLinkCommand, {
      nodeType: 'external-link',
      accelerator: 'CommandOrControl+K',
      commandGroup: 'formatting'
    })
    config.addCommand('delete-columns', DeleteCellsCommand, {
      spec: { dim: 'col' },
      commandGroup: 'table-delete'
    })
    config.addCommand('delete-rows', DeleteCellsCommand, {
      spec: { dim: 'row' },
      commandGroup: 'table-delete'
    })
    config.addCommand('edit-author', EditEntityCommand, {
      selectionType: 'author',
      commandGroup: 'author'
    })
    config.addCommand('edit-external-link', EditAnnotationCommand, {
      nodeType: 'external-link',
      commandGroup: 'prompt'
    })
    config.addCommand('edit-reference', EditEntityCommand, {
      selectionType: 'reference',
      commandGroup: 'reference'
    })
    config.addCommand('edit-xref', EditXrefCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })
    config.addCommand('insert-columns-left', InsertCellsCommand, {
      spec: { dim: 'col', pos: 'left' },
      commandGroup: 'table-insert'
    })
    config.addCommand('insert-columns-right', InsertCellsCommand, {
      spec: { dim: 'col', pos: 'right' },
      commandGroup: 'table-insert'
    })
    config.addCommand('insert-rows-above', InsertCellsCommand, {
      spec: { dim: 'row', pos: 'above' },
      commandGroup: 'table-insert'
    })
    config.addCommand('insert-rows-below', InsertCellsCommand, {
      spec: { dim: 'row', pos: 'below' },
      commandGroup: 'table-insert'
    })
    config.addCommand('insert-table', InsertTableCommand, {
      nodeType: 'table-figure',
      commandGroup: 'insert'
    })
    config.addCommand('insert-xref-bibr', InsertCrossReferenceCommand, {
      refType: Reference.refType,
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-figure', InsertCrossReferenceCommand, {
      refType: Figure.refType,
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-file', InsertCrossReferenceCommand, {
      refType: SupplementaryFile.refType,
      commandGroup: 'insert-xref'
    })
    // Note: footnote cross-references are special, because they take the current scope into account
    // i.e. whether to create a footnote on article level, or inside a table-figure
    config.addCommand('insert-xref-footnote', InsertFootnoteCrossReferenceCommand, {
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-formula', InsertCrossReferenceCommand, {
      refType: BlockFormula.refType,
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-table', InsertCrossReferenceCommand, {
      refType: Table.refType,
      commandGroup: 'insert-xref'
    })
    config.addCommand('move-down-col-item', MoveCollectionItemCommand, {
      direction: 'down',
      commandGroup: 'collection'
    })
    config.addCommand('move-down-metadata-field', MoveCustomMetadataFieldCommand, {
      direction: 'down',
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'figure-panel'
    })
    config.addCommand('move-up-col-item', MoveCollectionItemCommand, {
      direction: 'up',
      commandGroup: 'collection'
    })
    config.addCommand('move-up-metadata-field', MoveCustomMetadataFieldCommand, {
      direction: 'up',
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'figure-panel'
    })
    config.addCommand('open-figure-panel-image', OpenFigurePanelImageCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('open-manuscript', SwitchViewCommand, {
      viewName: 'manuscript',
      commandGroup: 'switch-view'
    })
    config.addCommand('open-metadata', SwitchViewCommand, {
      viewName: 'metadata',
      commandGroup: 'switch-view'
    })
    config.addCommand('remove-col-item', RemoveCollectionItemCommand, {
      commandGroup: 'collection'
    })
    config.addCommand('remove-footnote', RemoveItemCommand, {
      nodeType: 'footnote',
      commandGroup: 'footnote'
    })
    config.addCommand('remove-metadata-field', RemoveCustomMetadataFieldCommand, {
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('remove-reference', RemoveReferenceCommand, {
      commandGroup: 'reference'
    })
    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('table:select-all', TableSelectAllCommand)
    config.addCommand('toggle-bold', AnnotationCommand, {
      nodeType: 'bold',
      accelerator: 'CommandOrControl+B',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-cell-heading', ToggleCellHeadingCommand, {
      commandGroup: 'table'
    })
    config.addCommand('toggle-cell-merge', ToggleCellMergeCommand, {
      commandGroup: 'table'
    })
    config.addCommand('toggle-italic', AnnotationCommand, {
      nodeType: 'italic',
      accelerator: 'CommandOrControl+I',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-monospace', AnnotationCommand, {
      nodeType: 'monospace',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-overline', AnnotationCommand, {
      nodeType: 'overline',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-small-caps', AnnotationCommand, {
      nodeType: 'small-caps',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-strike-through', AnnotationCommand, {
      nodeType: 'strike-through',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-subscript', AnnotationCommand, {
      nodeType: 'sub',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-superscript', AnnotationCommand, {
      nodeType: 'sup',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-underline', AnnotationCommand, {
      nodeType: 'underline',
      commandGroup: 'formatting'
    })

    // Toolpanels
    config.addToolPanel('main-overlay', [
      {
        name: 'prompt',
        type: 'prompt',
        style: 'minimal',
        hideDisabled: true,
        items: [
          { type: 'command-group', name: 'prompt' }
        ]
      }
    ])

    // Tools
    config.addComponent('add-figure-panel', InsertFigurePanelTool)
    config.addComponent('edit-external-link', EditExtLinkTool)
    config.addComponent('edit-xref', EditXrefTool)
    config.addComponent('open-figure-panel-image', OpenFigurePanelImageTool)
    config.addComponent('replace-figure-panel-image', ReplaceFigurePanelTool)

    // KeyboardShortcuts
    config.addKeyboardShortcut('CommandOrControl+Alt+Up', { command: 'move-up-col-item' })
    config.addKeyboardShortcut('CommandOrControl+Alt+Down', { command: 'move-down-col-item' })
    config.addKeyboardShortcut('CommandOrControl+Alt+Delete', { command: 'remove-col-item' })

    // Labels
    config.addLabel('abstracts', 'Abstracts')
    config.addLabel('article', 'Article Information')
    config.addLabel('article-information', 'Article Information')
    config.addLabel('authors', 'Authors')
    config.addLabel('figures', 'Figures')
    config.addLabel('footnotes', 'Footnotes')
    config.addLabel('groups', 'Groups')
    config.addLabel('issueTitle', 'Issue Title')
    config.addLabel('keywords', 'Keywords')
    config.addLabel('subjects', 'Subjects')
    config.addLabel('organisations', 'Affiliations')
    config.addLabel('references', 'References')
    config.addLabel('tables', 'Tables')
    config.addLabel('translations', 'Translations')
    config.addLabel('add-reference-title', 'Add Reference(s)')
    config.addLabel('add-ref-manually', 'Or create manually')
    config.addLabel('fetch-datacite', 'Fetch from DataCite')
    config.addLabel('enter-doi-placeholder', 'Enter one or more DOIs')
    config.addLabel('add-action', 'Add')
    config.addLabel('enter-url-placeholder', 'Enter url')
    config.addLabel('import-refs', 'Import')
    config.addLabel('supported-ref-formats', 'Supported formats')
    config.addLabel('original-translation', 'Original')
    config.addLabel('add-translation', 'Add Translation')
    config.addLabel('select-language', 'Select language')
    config.addLabel('add', 'Add')
    config.addLabel('edit', 'Edit')
    config.addLabel('remove', 'Remove')
    config.addLabel('workflows', 'Workflows')
    config.addLabel('select-abstract-type', 'Select abstract type')
    config.addLabel('select-license', 'Select license')
    config.addLabel('select-item', 'Choose')
    config.addLabel('move-down-figure-panel', 'Move Down Sub-Figure')
    config.addLabel('enter-custom-field-name', 'Enter name')
    config.addLabel('enter-custom-field-value', 'Enter value')
    config.addLabel('article-metadata', 'Article Metadata')
    config.addLabel('subtitle', 'Subtitle')
    config.addLabel('empty-figure-metadata', 'No fields specified')
    config.addLabel('open-link', 'Open Link')
    // Icons
    config.addIcon('input-error', { 'fontawesome': 'fa-exclamation-circle' })
    config.addIcon('input-loading', { 'fontawesome': 'fa-spinner fa-spin' })
    config.addIcon('move-down-figure-panel', { 'fontawesome': 'fa-caret-square-o-down' })
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' })

    // TODO: need to rethink this a some point
    registerCollectionCommand(config, 'author', ['metadata', 'authors'], { keyboardShortcut: 'CommandOrControl+Alt+A', nodeType: 'person' })
    registerCollectionCommand(config, 'funder', ['metadata', 'funders'], { keyboardShortcut: 'CommandOrControl+Alt+Y' })
    registerCollectionCommand(config, 'editor', ['metadata', 'editors'], { keyboardShortcut: 'CommandOrControl+Alt+E', nodeType: 'person' })
    registerCollectionCommand(config, 'footnote', ['article', 'footnotes'], { automaticOrder: true, Command: InsertFootnoteCommand })
    registerCollectionCommand(config, 'group', ['metadata', 'groups'], { keyboardShortcut: 'CommandOrControl+Alt+G' })
    registerCollectionCommand(config, 'keyword', ['metadata', 'keywords'], { keyboardShortcut: 'CommandOrControl+Alt+K' })
    registerCollectionCommand(config, 'organisation', ['metadata', 'organisations'], { keyboardShortcut: 'CommandOrControl+Alt+O' })
    registerCollectionCommand(config, 'subject', ['metadata', 'subjects'])
    registerCollectionCommand(config, 'custom-abstract', ['article', 'customAbstracts'], { Command: InsertCustomAbstractCommand })
    config.addCommand('insert-reference', AddEntityCommand, {
      workflow: 'add-reference',
      commandGroup: 'add-entity',
      type: 'bibr'
    })
  }
}

// TODO: this is like an overkill, registering one collection item command
// for every collection type
// it would be better to have just one set of commands
// which is detecting the collection automagically
// The challenge will then be how to control certain things,
// such as disabling move up/down etc.
function registerCollectionCommand (config, itemType, collectionPath, options = {}) {
  let nodeType = options.nodeType || itemType
  let xpathSelector = getKeyForPath(collectionPath)
  let Command = options.Command || AddEntityCommand
  config.addCommand(`insert-${itemType}`, Command, {
    type: nodeType,
    collection: collectionPath,
    commandGroup: 'add-entity'
  })
  if (options.keyboardShortcut) {
    config.addKeyboardShortcut(options.keyboardShortcut, { command: `add-${itemType}` })
  }
  if (!options.automaticOrder) {
    config.addCommand(`move-up-${itemType}`, MoveCollectionItemCommand, {
      direction: 'up',
      commandGroup: 'collection',
      xpathSelector
    })
    config.addIcon(`move-up-${itemType}`, { 'fontawesome': 'fa-caret-square-o-up' })
    config.addLabel(`move-up-${itemType}`, {
      en: 'Move item up'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Up', { command: `move-up-${itemType}` })
    config.addCommand(`move-down-${itemType}`, MoveCollectionItemCommand, {
      direction: 'down',
      commandGroup: 'collection',
      xpathSelector
    })
    config.addIcon(`move-down-${itemType}`, { 'fontawesome': 'fa-caret-square-o-down' })
    config.addLabel(`move-down-${itemType}`, {
      en: 'Move item down'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Down', { command: `move-down-${itemType}` })
    config.addCommand(`remove-${itemType}`, RemoveCollectionItemCommand, {
      commandGroup: 'collection',
      xpathSelector
    })

    config.addIcon('remove', { 'fontawesome': 'fa-trash' })
    config.addIcon('checked-item', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked-item', { 'fontawesome': 'fa-square-o' })
  }
  config.addIcon(`remove-${itemType}`, { 'fontawesome': 'fa-trash' })
  config.addLabel(`remove-${itemType}`, {
    en: 'Remove item'
  })
  config.addKeyboardShortcut('CommandOrControl+Alt+Delete', { command: `remove-${itemType}` })
}
