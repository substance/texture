/* eslint-disable no-template-curly-in-string */
import { ListPackage, MultiSelectPackage, AnnotationCommand } from 'substance'
import {
  BasePackage, EditorBasePackage, ModelComponentPackage, FindAndReplacePackage
} from '../../kit'
import ArticleToolbarPackage from './ArticleToolbarPackage'
import EntityLabelsPackage from './EntityLabelsPackage'
import ManuscriptContentPackage from './ManuscriptContentPackage'
import PersistencePackage from '../../shared/PersistencePackage'

import {
  AddAuthorCommand, AddAffiliationCommand, AddEntityCommand,
  AddFigureMetadataFieldCommand, AddFigurePanelCommand,
  AddReferenceCommand,
  MoveMetadataFieldCommand, RemoveMetadataFieldCommand,
  InsertExtLinkCommand,
  DecreaseHeadingLevelCommand,
  DeleteCellsCommand,
  DownloadSupplementaryFileCommand,
  EditAuthorCommand, EditReferenceCommand,
  IncreaseHeadingLevelCommand,
  InsertBlockFormulaCommand,
  InsertBlockQuoteCommand,
  InsertCellsCommand,
  InsertFigureCommand,
  InsertNodeFromWorkflowCommand,
  InsertFootnoteCommand,
  InsertInlineFormulaCommand,
  InsertInlineGraphicCommand,
  InsertTableCommand,
  InsertCrossReferenceCommand,
  InsertFootnoteCrossReferenceCommand,
  MoveFigurePanelCommand,
  OpenFigurePanelImageCommand,
  RemoveFigurePanelCommand,
  RemoveFootnoteCommand,
  ReplaceFigurePanelImageCommand,
  ReplaceSupplementaryFileCommand,
  TableSelectAllCommand,
  ToggleCellHeadingCommand,
  ToggleCellMergeCommand,
  ChangeListTypeCommand,
  CreateListCommand,
  EditMetadataCommand
} from '../commands'

import {
  FigureComponent, AddSupplementaryFileWorkflow, FigurePanelComponent,
  TableFigureComponent, FootnoteComponent, ReferenceComponent,
  ReferenceListComponent, ManuscriptTOC, InsertFigurePanelTool,
  DownloadSupplementaryFileTool, InsertFigureTool, InsertInlineGraphicTool,
  OpenFigurePanelImageTool, ReplaceFigurePanelTool,
  ReplaceSupplementaryFileTool, InsertTableTool, ManuscriptEditor
} from '../components'

import { BlockFormula, Figure, Reference, SupplementaryFile, Table } from '../nodes'

import DropFigure from './DropFigure'

import { AddAuthorWorkflow, AddAffiliationWorkflow, AddReferenceWorkflow } from '../workflows'
import EditMetadataWorkflow from '../metadata/EditMetadataWorkflow'

export default {
  name: 'ManuscriptEditor',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ModelComponentPackage)
    config.import(ManuscriptContentPackage)
    config.import(MultiSelectPackage)
    config.import(ArticleToolbarPackage)
    config.import(PersistencePackage)
    config.import(FindAndReplacePackage)

    config.addComponent('add-supplementary-file', AddSupplementaryFileWorkflow)
    config.addComponent('toc', ManuscriptTOC)

    config.addCommand('add-author', AddAuthorCommand)
    config.addCommand('add-affiliation', AddAffiliationCommand)
    config.addCommand('add-metadata-field', AddFigureMetadataFieldCommand, {
      commandGroup: 'metadata-fields'
    })
    config.addCommand('add-figure-panel', AddFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('add-reference', AddReferenceCommand)

    config.addCommand('create-external-link', InsertExtLinkCommand, {
      nodeType: 'external-link',
      accelerator: 'CommandOrControl+K',
      commandGroup: 'formatting'
    })
    config.addCommand('decrease-heading-level', DecreaseHeadingLevelCommand, {
      commandGroup: 'text'
    })
    config.addCommand('dedent-list', ListPackage.IndentListCommand, {
      spec: { action: 'dedent' },
      commandGroup: 'list'
    })
    config.addCommand('delete-columns', DeleteCellsCommand, {
      spec: { dim: 'col' },
      commandGroup: 'table-delete'
    })
    config.addCommand('delete-rows', DeleteCellsCommand, {
      spec: { dim: 'row' },
      commandGroup: 'table-delete'
    })
    config.addCommand('download-file', DownloadSupplementaryFileCommand, {
      commandGroup: 'file'
    })
    config.addCommand('edit-author', EditAuthorCommand, {
      commandGroup: 'entities'
    })
    config.addCommand('edit-metadata', EditMetadataCommand)
    config.addCommand('edit-reference', EditReferenceCommand, {
      commandGroup: 'entities'
    })
    config.addCommand('increase-heading-level', IncreaseHeadingLevelCommand, {
      commandGroup: 'text'
    })
    config.addCommand('indent-list', ListPackage.IndentListCommand, {
      spec: { action: 'indent' },
      commandGroup: 'list'
    })
    config.addCommand('insert-block-formula', InsertBlockFormulaCommand, {
      nodeType: 'block-formula',
      commandGroup: 'insert'
    })
    config.addCommand('insert-block-quote', InsertBlockQuoteCommand, {
      nodeType: 'block-quote',
      commandGroup: 'insert'
    })
    config.addCommand('insert-columns-left', InsertCellsCommand, {
      spec: { dim: 'col', pos: 'left' },
      commandGroup: 'table-insert'
    })
    config.addCommand('insert-columns-right', InsertCellsCommand, {
      spec: { dim: 'col', pos: 'right' },
      commandGroup: 'table-insert'
    })
    config.addCommand('insert-figure', InsertFigureCommand, {
      nodeType: 'figure',
      commandGroup: 'insert'
    })
    config.addCommand('insert-file', InsertNodeFromWorkflowCommand, {
      workflow: 'add-supplementary-file',
      nodeType: 'supplementary-file',
      commandGroup: 'insert'
    })
    config.addCommand('insert-footnote', InsertFootnoteCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('insert-inline-formula', InsertInlineFormulaCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('insert-inline-graphic', InsertInlineGraphicCommand, {
      nodeType: 'inline-graphic',
      commandGroup: 'insert'
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
    config.addCommand('move-down-metadata-field', MoveMetadataFieldCommand, {
      direction: 'down',
      commandGroup: 'metadata-fields'
    })
    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'figure-panel'
    })
    config.addCommand('move-up-metadata-field', MoveMetadataFieldCommand, {
      direction: 'up',
      commandGroup: 'metadata-fields'
    })
    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'figure-panel'
    })
    config.addCommand('open-figure-panel-image', OpenFigurePanelImageCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('remove-metadata-field', RemoveMetadataFieldCommand, {
      commandGroup: 'metadata-fields'
    })
    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('remove-footnote', RemoveFootnoteCommand, {
      nodeType: 'footnote',
      commandGroup: 'footnote'
    })
    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('replace-file', ReplaceSupplementaryFileCommand, {
      commandGroup: 'file'
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
    config.addCommand('toggle-ordered-list', ChangeListTypeCommand, {
      spec: { listType: 'order' },
      commandGroup: 'list'
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
      nodeType: 'subscript',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-superscript', AnnotationCommand, {
      nodeType: 'superscript',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-underline', AnnotationCommand, {
      nodeType: 'underline',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-unordered-list', ChangeListTypeCommand, {
      spec: { listType: 'bullet' },
      commandGroup: 'list'
    })

    // Workflows
    config.addComponent('add-affiliation-workflow', AddAffiliationWorkflow)
    config.addComponent('add-author-workflow', AddAuthorWorkflow)
    config.addComponent('add-reference-workflow', AddReferenceWorkflow)
    config.addComponent('edit-metadata-workflow', EditMetadataWorkflow)

    // Labels
    config.addLabel('add-author', 'Add Author')
    config.addLabel('add-ref', 'Add Reference')
    config.addLabel('article-info', 'Article Information')
    config.addLabel('article-record', 'Article Record')
    config.addLabel('contributors', 'Authors & Contributors')
    config.addLabel('create-unordered-list', 'Bulleted list')
    config.addLabel('create-ordered-list', 'Numbered list')
    config.addLabel('edit-ref', 'Edit Reference')
    config.addLabel('file-location', 'File location')
    config.addLabel('file-name', 'File name')
    config.addLabel('manuscript-start', 'Article starts here')
    config.addLabel('manuscript-end', 'Article ends here')
    config.addLabel('no-authors', 'No Authors')
    config.addLabel('no-editors', 'No Editors')
    config.addLabel('no-references', 'No References')
    config.addLabel('no-footnotes', 'No Footnotes')
    config.addLabel('open-link', 'Open Link')
    config.addLabel('pub-data', 'Publication Data')
    config.addLabel('sig-block-start', 'Signature Block starts here')
    config.addLabel('sig-block-end', 'Signature Block ends here')
    config.addLabel('structure', 'Structure')
    config.addLabel('toc', 'Table of Contents')
    config.addLabel('remove-ref', 'Remove')
    config.addLabel('toggle-unordered-list', 'Bulleted list')
    config.addLabel('toggle-ordered-list', 'Numbered list')
    config.addLabel('enter-custom-field-name', 'Enter name')
    config.addLabel('enter-custom-field-value', 'Enter value')
    config.addLabel('add-action', 'Add')
    config.addLabel('enter-url-placeholder', 'Enter url')

    // Icons
    config.addIcon('create-unordered-list', { 'fontawesome': 'fa-list-ul' })
    config.addIcon('create-ordered-list', { 'fontawesome': 'fa-list-ol' })
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' })
    config.addIcon('pencil', { 'fontawesome': 'fa-pencil' })
    config.addIcon('toggle-unordered-list', { 'fontawesome': 'fa-list-ul' })
    config.addIcon('toggle-ordered-list', { 'fontawesome': 'fa-list-ol' })
    config.addIcon('trash', { 'fontawesome': 'fa-trash' })
    config.addIcon('input-loading', { 'fontawesome': 'fa-spinner fa-spin' })
    config.addIcon('input-error', { 'fontawesome': 'fa-exclamation-circle' })
    config.addIcon('left-control', { 'fontawesome': 'fa-chevron-left' })
    config.addIcon('right-control', { 'fontawesome': 'fa-chevron-right' })

    // Tools
    config.addComponent('add-figure-panel', InsertFigurePanelTool)
    config.addComponent('download-file', DownloadSupplementaryFileTool)
    config.addComponent('insert-figure', InsertFigureTool)
    config.addComponent('insert-inline-graphic', InsertInlineGraphicTool)
    config.addComponent('open-figure-panel-image', OpenFigurePanelImageTool)
    config.addComponent('replace-figure-panel-image', ReplaceFigurePanelTool)
    config.addComponent('replace-file', ReplaceSupplementaryFileTool)
    config.addComponent('insert-table', InsertTableTool)

    // DropDownHandler
    config.addDropHandler(DropFigure)

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
    config.addCommand('create-unordered-list', CreateListCommand, {
      spec: { listType: 'bullet' },
      commandGroup: 'text-types'
    })
    config.addCommand('create-ordered-list', CreateListCommand, {
      spec: { listType: 'order' },
      commandGroup: 'text-types'
    })
    config.addTextTypeTool({
      name: 'switch-to-preformat',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'preformat'
      },
      icon: 'fa-font',
      label: 'Preformat',
      accelerator: 'CommandOrControl+E'
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

    config.addToolPanel('workflow', [
      {
        name: 'workflow',
        type: 'group',
        items: [
          { type: 'command-group', name: 'workflows' }
        ]
      }
    ])

    // KeyboardShortcuts
    config.addKeyboardShortcut('CommandOrControl+a', { command: 'table:select-all' })

    // Register commands and keyboard shortcuts for collections
    // registerCollectionCommand(config, 'author', ['metadata', 'authors'], { keyboardShortcut: 'CommandOrControl+Alt+A', nodeType: 'person' })
    registerCollectionCommand(config, 'funder', ['metadata', 'funders'], { keyboardShortcut: 'CommandOrControl+Alt+Y' })
    registerCollectionCommand(config, 'editor', ['metadata', 'editors'], { keyboardShortcut: 'CommandOrControl+Alt+E', nodeType: 'person' })
    registerCollectionCommand(config, 'group', ['metadata', 'groups'], { keyboardShortcut: 'CommandOrControl+Alt+G' })
    registerCollectionCommand(config, 'keyword', ['metadata', 'keywords'], { keyboardShortcut: 'CommandOrControl+Alt+K' })
    registerCollectionCommand(config, 'organisation', ['metadata', 'organisations'], { keyboardShortcut: 'CommandOrControl+Alt+O' })
    registerCollectionCommand(config, 'subject', ['metadata', 'subjects'])
  },
  ManuscriptEditor,
  // legacy
  Editor: ManuscriptEditor
}

// For now we just switch view and do the same action as in metadata editor
// TODO: later we will probably have just one set of commands for register collection
function registerCollectionCommand (config, itemType, collectionPath, options = {}) {
  let nodeType = options.nodeType || itemType
  config.addCommand(`insert-${itemType}`, AddEntityCommand, {
    type: nodeType,
    collection: collectionPath,
    commandGroup: 'add-entity',
    metadataOnly: true
  })
  if (options.keyboardShortcut) {
    config.addKeyboardShortcut(options.keyboardShortcut, { command: `add-${itemType}` })
  }
}
