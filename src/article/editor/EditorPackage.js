/* eslint-disable no-template-curly-in-string */
import {
  EditAnnotationCommand,
  ListPackage,
  SchemaDrivenCommandManager,
  MultiSelectPackage,
  AnnotationCommand
} from 'substance'

import {
  BasePackage, EditorBasePackage, ModelComponentPackage, FindAndReplacePackage
} from '../../kit'

import ArticleNavPackage from '../ArticleNavPackage'
import ArticleToolbarPackage from '../shared/ArticleToolbarPackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'
import PersistencePackage from '../../PersistencePackage'

import ReferenceListComponent from '../shared/ReferenceListComponent'
import EditXrefTool from './EditXrefTool'
import EditExtLinkTool from './EditExtLinkTool'
import ManuscriptEditor from './ManuscriptEditor'
import ManuscriptTOC from './ManuscriptTOC'
import FigureComponent from '../shared/FigureComponent'
import FigurePanelComponent from '../shared/FigurePanelComponent'
import TableFigureComponent from '../shared/TableFigureComponent'
import FootnoteComponent from '../shared/FootnoteComponent'
import ReferenceComponent from '../shared/ReferenceComponent'

import AddSupplementaryFileWorkflow from '../shared/AddSupplementaryFileWorkflow'

import {
  AddFigurePanelCommand, MoveFigurePanelCommand,
  RemoveFigurePanelCommand, ReplaceFigurePanelImageCommand
} from '../shared/FigurePanelCommands'
import DecreaseHeadingLevelCommand from './DecreaseHeadingLevelCommand'
import DownloadSupplementaryFileCommand from './DownloadSupplementaryFileCommand'
import DropFigure from './DropFigure'
import EditBlockFormulaCommand from '../shared/EditBlockFormulaCommand'
import EditDispFormulaTool from './EditDispFormulaTool'
import EditInlineFormulaCommand from '../shared/EditInlineFormulaCommand'
import EditInlineFormulaTool from './EditInlineFormulaTool'
import EditXrefCommand from '../shared/EditXrefCommand'
import IncreaseHeadingLevelCommand from './IncreaseHeadingLevelCommand'
import InsertCrossReferenceCommand from './InsertCrossReferenceCommand'
import InsertDispFormulaCommand from './InsertDispFormulaCommand'
import InsertDispQuoteCommand from './InsertDispQuoteCommand'
import InsertExtLinkCommand from './InsertExtLinkCommand'
import InsertFigureCommand from './InsertFigureCommand'
import InsertFigureTool from './InsertFigureTool'
import { InsertFigurePanelTool, ReplaceFigurePanelTool } from '../shared/FigurePanelTools'
import InsertFootnoteCommand from '../shared/InsertFootnoteCommand'
import InsertFootnoteCrossReferenceCommand from './InsertFootnoteCrossReferenceCommand'
import InsertInlineFormulaCommand from './InsertInlineFormulaCommand'
import InsertInlineGraphicCommand from './InsertInlineGraphicCommand'
import InsertInlineGraphicTool from './InsertInlineGraphicTool'
import { CreateListCommand, ChangeListTypeCommand } from './ListCommands'
import InsertNodeFromWorkflowCommand from './InsertNodeFromWorkflowCommand'
import {
  InsertTableCommand, InsertCellsCommand, DeleteCellsCommand,
  TableSelectAllCommand, ToggleCellHeadingCommand, ToggleCellMergeCommand
} from './TableCommands'
import InsertTableTool from './InsertTableTool'
import RemoveItemCommand from './RemoveItemCommand'
import ReplaceSupplementaryFileCommand from './ReplaceSupplementaryFileCommand'
import { ReplaceSupplementaryFileTool } from './SupplementaryFileTools'
import {
  AddCustomMetadataFieldCommand, MoveCustomMetadataFieldCommand, RemoveCustomMetadataFieldCommand
} from '../shared/CustomMetadataFieldCommands'

export default {
  name: 'ManscruptEditor',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ModelComponentPackage)
    config.import(ManuscriptContentPackage)
    config.import(MultiSelectPackage)
    config.import(EntityLabelsPackage)
    config.import(ArticleNavPackage)
    config.import(ArticleToolbarPackage)
    config.import(PersistencePackage)
    config.import(FindAndReplacePackage)

    // EXPERIMENTAL:
    // a CommandManager that uses the xmlSchema to inhibit commands
    // which would generate disallowed content
    config.setCommandManagerClass(SchemaDrivenCommandManager)

    config.addComponent('add-supplementary-file', AddSupplementaryFileWorkflow)
    config.addComponent('figure', FigureComponent, true)
    config.addComponent('figure-panel', FigurePanelComponent, true)
    config.addComponent('table-figure', TableFigureComponent, true)
    config.addComponent('footnote', FootnoteComponent, true)
    config.addComponent('reference', ReferenceComponent, true)
    config.addComponent('reference-list', ReferenceListComponent, true)
    config.addComponent('toc', ManuscriptTOC, true)

    config.addCommand('add-custom-metadata-field', AddCustomMetadataFieldCommand, {
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
    config.addCommand('decrease-heading-level', DecreaseHeadingLevelCommand, {
      commandGroup: 'text-level'
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
    config.addCommand('edit-block-formula', EditBlockFormulaCommand, {
      commandGroup: 'prompt'
    })
    config.addCommand('edit-external-link', EditAnnotationCommand, {
      nodeType: 'external-link',
      commandGroup: 'prompt'
    })
    config.addCommand('edit-formula', EditInlineFormulaCommand, {
      nodeType: 'inline-formula',
      commandGroup: 'prompt'
    })
    config.addCommand('edit-xref', EditXrefCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })
    config.addCommand('increase-heading-level', IncreaseHeadingLevelCommand, {
      commandGroup: 'text-level'
    })
    config.addCommand('indent-list', ListPackage.IndentListCommand, {
      spec: { action: 'indent' },
      commandGroup: 'list'
    })
    config.addCommand('insert-block-formula', InsertDispFormulaCommand, {
      nodeType: 'block-formula',
      commandGroup: 'insert'
    })
    config.addCommand('insert-block-quote', InsertDispQuoteCommand, {
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
      refType: 'bibr',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-figure', InsertCrossReferenceCommand, {
      refType: 'fig',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-file', InsertCrossReferenceCommand, {
      refType: 'file',
      commandGroup: 'insert-xref'
    })
    // Note: footnote cross-references are special, because they take the current scope into account
    // i.e. whether to create a footnote on article level, or inside a table-figure
    config.addCommand('insert-xref-footnote', InsertFootnoteCrossReferenceCommand, {
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-formula', InsertCrossReferenceCommand, {
      refType: 'formula',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-table', InsertCrossReferenceCommand, {
      refType: 'table',
      commandGroup: 'insert-xref'
    })
    config.addCommand('move-down-custom-metadata-field', MoveCustomMetadataFieldCommand, {
      direction: 'down',
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'figure-panel'
    })
    config.addCommand('move-up-custom-metadata-field', MoveCustomMetadataFieldCommand, {
      direction: 'up',
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'figure-panel'
    })
    config.addCommand('remove-custom-metadata-field', RemoveCustomMetadataFieldCommand, {
      commandGroup: 'custom-metadata-fields'
    })
    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('remove-footnote', RemoveItemCommand, {
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
    config.addCommand('toggle-subscript', AnnotationCommand, {
      nodeType: 'subscript',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-superscript', AnnotationCommand, {
      nodeType: 'superscript',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-unordered-list', ChangeListTypeCommand, {
      spec: { listType: 'bullet' },
      commandGroup: 'list'
    })

    // Labels
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
    config.addLabel('translations', 'Translations')
    config.addLabel('edit-ref', 'Edit')
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

    // Tools
    config.addTool('add-figure-panel', InsertFigurePanelTool)
    config.addTool('edit-block-formula', EditDispFormulaTool)
    config.addTool('edit-external-link', EditExtLinkTool)
    config.addTool('edit-formula', EditInlineFormulaTool)
    config.addTool('edit-xref', EditXrefTool)
    config.addTool('insert-figure', InsertFigureTool)
    config.addTool('insert-inline-graphic', InsertInlineGraphicTool)
    config.addTool('replace-figure-panel-image', ReplaceFigurePanelTool)
    config.addTool('replace-file', ReplaceSupplementaryFileTool)

    config.addTool('insert-table', InsertTableTool)

    // DropDownHandler
    config.addDropHandler(DropFigure)

    // SwitchTextTypes
    config.addTextTypeTool({
      name: 'heading1',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        attributes: { level: '1' }
      },
      icon: 'fa-header',
      label: 'Heading 1',
      accelerator: 'CommandOrControl+Alt+1'
    })
    config.addTextTypeTool({
      name: 'heading2',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        attributes: { level: '2' }
      },
      icon: 'fa-header',
      label: 'Heading 2',
      accelerator: 'CommandOrControl+Alt+2'
    })
    config.addTextTypeTool({
      name: 'heading3',
      commandGroup: 'text-types',
      nodeSpec: {
        type: 'heading',
        attributes: { level: '3' }
      },
      icon: 'fa-header',
      label: 'Heading 3',
      accelerator: 'CommandOrControl+Alt+3'
    })
    config.addTextTypeTool({
      name: 'paragraph',
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
      name: 'preformat',
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

    config.addToolPanel('context-menu', [
      {
        name: 'context-menu',
        type: 'group',
        style: 'descriptive',
        items: [
          // TODO: specify what should go into the context menu
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

    config.addToolPanel('table-context-menu', [
      {
        name: 'table-context-menu',
        type: 'group',
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'table-insert' },
          { type: 'command-group', name: 'table-delete' }
        ]
      }
    ])

    // KeyboardShortcuts
    config.addKeyboardShortcut('shift+tab', { command: 'decrease-heading-level' })
    config.addKeyboardShortcut('tab', { command: 'increase-heading-level' })
    config.addKeyboardShortcut('CommandOrControl+a', { command: 'table:select-all' })
  },
  ManuscriptEditor,
  // legacy
  Editor: ManuscriptEditor
}
