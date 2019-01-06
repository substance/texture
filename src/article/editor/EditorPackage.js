/* eslint-disable no-template-curly-in-string */
import {
  EditAnnotationCommand,
  ListPackage,
  SchemaDrivenCommandManager,
  MultiSelectPackage,
  AnnotationCommand,
  EditInlineNodeCommand
} from 'substance'

import {
  BasePackage, EditorBasePackage, ModelComponentPackage, FindAndReplacePackage
} from '../../kit'

import ArticleNavPackage from '../ArticleNavPackage'
import ArticleToolbarPackage from '../ArticleToolbarPackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'
import PersistencePackage from '../../PersistencePackage'

import ReferenceListComponent from '../shared/ReferenceListComponent'
import EditXrefTool from './EditXrefTool'
import EditExtLinkTool from './EditExtLinkTool'
import ManuscriptEditor from './ManuscriptEditor'
import TOC from './TOC'
import FigureComponent from '../shared/FigureComponent'
import FigurePanelComponent from '../shared/FigurePanelComponent'
import TableFigureComponent from '../shared/TableFigureComponent'
import FootnoteComponent from '../shared/FootnoteComponent'
import ReferenceComponent from '../shared/ReferenceComponent'

import {
  AddFigurePanelCommand, MoveFigurePanelCommand,
  RemoveFigurePanelCommand, ReplaceFigurePanelImageCommand
} from '../shared/FigurePanelCommands'
import DecreaseHeadingLevelCommand from './DecreaseHeadingLevelCommand'
import DropFigure from './DropFigure'
import EditDispFormulaCommand from './EditDispFormulaCommand'
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
import InsertSupplementaryFileCommand from './InsertSupplementaryFileCommand'
import InsertSupplementaryFileTool from './InsertSupplementaryFileTool'
import {
  InsertTableCommand, InsertCellsCommand, DeleteCellsCommand,
  TableSelectAllCommand, ToggleCellHeadingCommand, ToggleCellMergeCommand
} from './TableCommands'
import InsertTableTool from './InsertTableTool'
import RemoveItemCommand from './RemoveItemCommand'
import ReplaceSupplementaryFileCommand from './ReplaceSupplementaryFileCommand'
import ReplaceSupplementaryFileTool from './ReplaceSupplementaryFileTool'

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

    config.addComponent('figure', FigureComponent, true)
    config.addComponent('figure-panel', FigurePanelComponent, true)
    config.addComponent('table-figure', TableFigureComponent, true)
    config.addComponent('footnote', FootnoteComponent, true)
    config.addComponent('reference', ReferenceComponent, true)
    config.addComponent('reference-list', ReferenceListComponent, true)
    config.addComponent('toc', TOC, true)

    config.addCommand('edit-xref', EditXrefCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })
    // config.addCommand('edit-block-formula', EditInlineNodeCommand, {
    //   nodeType: 'disp-formula',
    //   commandGroup: 'prompt'
    // })
    config.addCommand('insert-xref-bibr', InsertCrossReferenceCommand, {
      refType: 'bibr',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-figure', InsertCrossReferenceCommand, {
      refType: 'fig',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-table', InsertCrossReferenceCommand, {
      refType: 'table',
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
    config.addCommand('insert-xref-file', InsertCrossReferenceCommand, {
      refType: 'file',
      commandGroup: 'insert-xref'
    })
    config.addTool('edit-xref', EditXrefTool)
    config.addCommand('edit-xref', EditInlineNodeCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })

    // Other insert tools
    config.addCommand('insert-block-quote', InsertDispQuoteCommand, {
      nodeType: 'disp-quote',
      commandGroup: 'insert'
    })
    config.addCommand('insert-inline-graphic', InsertInlineGraphicCommand, {
      nodeType: 'inline-graphic',
      commandGroup: 'insert'
    })

    // Heading tools
    config.addCommand('decrease-heading-level', DecreaseHeadingLevelCommand, {
      commandGroup: 'text-level'
    })
    config.addCommand('increase-heading-level', IncreaseHeadingLevelCommand, {
      commandGroup: 'text-level'
    })
    config.addKeyboardShortcut('shift+tab', { command: 'decrease-heading-level' })
    config.addKeyboardShortcut('tab', { command: 'increase-heading-level' })

    // Footnote tools
    config.addCommand('insert-footnote', InsertFootnoteCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('remove-footnote', RemoveItemCommand, {
      nodeType: 'footnote',
      commandGroup: 'footnote'
    })

    // Figure tools
    config.addCommand('insert-figure', InsertFigureCommand, {
      nodeType: 'figure',
      commandGroup: 'insert'
    })
    config.addCommand('add-figure-panel', AddFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'figure-panel'
    })
    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'figure-panel'
    })
    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'figure-panel'
    })
    config.addTool('insert-figure', InsertFigureTool)
    config.addDropHandler(DropFigure)
    config.addTool('add-figure-panel', InsertFigurePanelTool)
    config.addTool('replace-figure-panel-image', ReplaceFigurePanelTool)

    // File tools
    config.addCommand('insert-file', InsertSupplementaryFileCommand, {
      nodeType: 'supplementary-material',
      commandGroup: 'insert'
    })
    config.addCommand('remove-footnote', RemoveItemCommand, {
      nodeType: 'footnote',
      commandGroup: 'footnote'
    })
    config.addCommand('insert-inline-graphic', InsertInlineGraphicCommand, {
      nodeType: 'inline-graphic',
      commandGroup: 'insert'
    })
    config.addCommand('replace-file', ReplaceSupplementaryFileCommand, {
      commandGroup: 'file'
    })
    config.addTool('insert-file', InsertSupplementaryFileTool)
    config.addTool('replace-file', ReplaceSupplementaryFileTool)

    // Table tools
    config.addTool('insert-inline-graphic', InsertInlineGraphicTool)
    config.addCommand('insert-table', InsertTableCommand, {
      nodeType: 'table-figure',
      commandGroup: 'insert'
    })
    config.addCommand('insert-inline-formula', InsertInlineFormulaCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('edit-block-formula', EditDispFormulaCommand, {
      nodeType: 'disp-formula',
      commandGroup: 'prompt'
    })
    config.addCommand('edit-formula', EditInlineFormulaCommand, {
      nodeType: 'inline-formula',
      commandGroup: 'prompt'
    })
    config.addCommand('decrease-heading-level', DecreaseHeadingLevelCommand, {
      commandGroup: 'text-level'
    })
    config.addCommand('increase-heading-level', IncreaseHeadingLevelCommand, {
      commandGroup: 'text-level'
    })
    config.addKeyboardShortcut('shift+tab', { command: 'decrease-heading-level' })
    config.addKeyboardShortcut('tab', { command: 'increase-heading-level' })

    config.addTool('insert-table', InsertTableTool)
    config.addCommand('table:select-all', TableSelectAllCommand)
    config.addKeyboardShortcut('CommandOrControl+a', { command: 'table:select-all' })
    config.addCommand('toggle-cell-heading', ToggleCellHeadingCommand, {
      commandGroup: 'table'
    })
    config.addCommand('toggle-cell-merge', ToggleCellMergeCommand, {
      commandGroup: 'table'
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
    config.addCommand('delete-columns', DeleteCellsCommand, {
      spec: { dim: 'col' },
      commandGroup: 'table-delete'
    })
    config.addCommand('delete-rows', DeleteCellsCommand, {
      spec: { dim: 'row' },
      commandGroup: 'table-delete'
    })

    // Formula tools
    config.addCommand('insert-block-formula', InsertDispFormulaCommand, {
      nodeType: 'disp-formula',
      commandGroup: 'insert'
    })
    config.addCommand('insert-inline-formula', InsertInlineFormulaCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('edit-block-formula', EditDispFormulaCommand, {
      nodeType: 'disp-formula',
      commandGroup: 'prompt'
    })
    config.addTool('edit-block-formula', EditDispFormulaTool)
    config.addCommand('edit-formula', EditInlineNodeCommand, {
      nodeType: 'inline-formula',
      commandGroup: 'prompt'
    })
    config.addTool('edit-formula', EditInlineFormulaTool)

    // Annotation tools
    config.addCommand('toggle-bold', AnnotationCommand, {
      nodeType: 'bold',
      accelerator: 'CommandOrControl+B',
      commandGroup: 'formatting'
    })
    config.addCommand('toggle-italic', AnnotationCommand, {
      nodeType: 'italic',
      accelerator: 'CommandOrControl+I',
      commandGroup: 'formatting'
    })
    config.addCommand('create-ext-link', InsertExtLinkCommand, {
      nodeType: 'ext-link',
      accelerator: 'CommandOrControl+K',
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
    config.addCommand('toggle-monospace', AnnotationCommand, {
      nodeType: 'monospace',
      commandGroup: 'formatting'
    })

    // Text type tools
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

    config.addCommand('edit-external-link', EditAnnotationCommand, {
      nodeType: 'external-link',
      commandGroup: 'prompt'
    })

    // ExtLink
    config.addTool('edit-external-link', EditExtLinkTool)
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' })
    config.addLabel('open-link', 'Open Link')

    // Lists
    config.addCommand('create-unordered-list', CreateListCommand, {
      spec: { listType: 'bullet' },
      commandGroup: 'text-types'
    })
    config.addCommand('create-ordered-list', CreateListCommand, {
      spec: { listType: 'order' },
      commandGroup: 'text-types'
    })
    config.addCommand('switch-unordered-list', ChangeListTypeCommand, {
      spec: { listType: 'bullet' },
      commandGroup: 'list'
    })
    config.addCommand('switch-ordered-list', ChangeListTypeCommand, {
      spec: { listType: 'order' },
      commandGroup: 'list'
    })
    config.addCommand('indent-list', ListPackage.IndentListCommand, {
      spec: { action: 'indent' },
      commandGroup: 'list'
    })
    config.addCommand('dedent-list', ListPackage.IndentListCommand, {
      spec: { action: 'dedent' },
      commandGroup: 'list'
    })

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
          { type: 'command-group', name: 'table-structure' }
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

    // Labels for groups
    config.addLabel('structure', 'Structure')
    config.addLabel('article-info', 'Article Information')

    // Labels for panels
    config.addLabel('toc', 'Table of Contents')
    config.addLabel('article-record', 'Article Record')
    config.addLabel('contributors', 'Authors & Contributors')
    config.addLabel('translations', 'Translations')
    config.addLabel('pub-data', 'Publication Data')
    config.addLabel('edit-ref', 'Edit Reference')

    // Labels for empty lists
    config.addLabel('no-authors', 'No Authors')
    config.addLabel('no-editors', 'No Editors')
    config.addLabel('no-references', 'No References')
    config.addLabel('no-footnotes', 'No Footnotes')

    // Labels for buttons
    config.addLabel('add-ref', 'Add Reference')
    config.addLabel('edit-ref', 'Edit')
    config.addLabel('remove-ref', 'Remove')

    // Extlink tool
    config.addLabel('open-link', 'Open Link')

    // List tool
    config.addLabel('create-unordered-list', {
      en: 'Bulleted list',
      de: 'Liste'
    })
    config.addLabel('create-ordered-list', {
      en: 'Numbered list',
      de: 'Aufzählung'
    })
    config.addLabel('switch-unordered-list', {
      en: 'Bulleted list',
      de: 'Liste'
    })
    config.addLabel('switch-ordered-list', {
      en: 'Numbered list',
      de: 'Aufzählung'
    })

    // Other labels
    config.addLabel('manuscript-start', 'Article starts here')
    config.addLabel('manuscript-end', 'Article ends here')
    config.addLabel('sig-block-start', 'Signature Block starts here')
    config.addLabel('sig-block-end', 'Signature Block ends here')

    // Icons
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' })
    config.addIcon('create-unordered-list', { 'fontawesome': 'fa-list-ul' })
    config.addIcon('create-ordered-list', { 'fontawesome': 'fa-list-ol' })
    config.addIcon('switch-unordered-list', { 'fontawesome': 'fa-list-ul' })
    config.addIcon('switch-ordered-list', { 'fontawesome': 'fa-list-ol' })
    config.addIcon('pencil', { 'fontawesome': 'fa-pencil' })
    config.addIcon('trash', { 'fontawesome': 'fa-trash' })
  },
  ManuscriptEditor,
  // legacy
  Editor: ManuscriptEditor
}
