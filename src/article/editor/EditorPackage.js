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
import AddReferenceWorkflow from '../shared/AddReferenceWorkflow'
import EditReferenceWorkflow from './EditReferenceWorkflow'

import {
  AddFigurePanelCommand, MoveFigurePanelCommand,
  RemoveFigurePanelCommand, ReplaceFigurePanelImageCommand
} from '../shared/FigurePanelCommands'
import {
  InsertTableCommand, InsertCellsCommand, DeleteCellsCommand,
  TableSelectAllCommand, ToggleCellHeadingCommand, ToggleCellMergeCommand
} from './TableCommands'
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
import InsertTableTool from './InsertTableTool'
import InsertSupplementaryFileCommand from './InsertSupplementaryFileCommand'
import ToggleListCommand from './ToggleListCommand'
import RemoveItemCommand from './RemoveItemCommand'
import ReplaceSupplementaryFileCommand from './ReplaceSupplementaryFileCommand'
import { InsertSupplementaryFileTool, ReplaceSupplementaryFileTool } from './SupplementaryFileTools'

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

    // Commands
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
    config.addCommand('insert-xref-fig', InsertCrossReferenceCommand, {
      refType: 'fig',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-table', InsertCrossReferenceCommand, {
      refType: 'table',
      commandGroup: 'insert-xref'
    })
    // Note: footnote cross-references are special, because they take the current scope into account
    // i.e. whether to create a footnote on article level, or inside a table-figure
    config.addCommand('insert-xref-fn', InsertFootnoteCrossReferenceCommand, {
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
    config.addCommand('insert-disp-formula', InsertDispFormulaCommand, {
      nodeType: 'block-formula',
      commandGroup: 'insert'
    })
    config.addCommand('insert-disp-quote', InsertDispQuoteCommand, {
      nodeType: 'block-quote',
      commandGroup: 'insert'
    })
    config.addCommand('insert-supplementary-file', InsertSupplementaryFileCommand, {
      nodeType: 'supplementary-file',
      commandGroup: 'additional'
    })
    config.addCommand('replace-supplementary-file', ReplaceSupplementaryFileCommand, {
      commandGroup: 'context'
    })
    config.addCommand('insert-fig', InsertFigureCommand, {
      nodeType: 'figure',
      commandGroup: 'additional'
    })
    config.addCommand('add-figure-panel', AddFigurePanelCommand, {
      commandGroup: 'context'
    })
    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand, {
      commandGroup: 'context'
    })
    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'context'
    })
    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'context'
    })
    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'context'
    })
    config.addCommand('insert-footnote', InsertFootnoteCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('remove-footnote', RemoveItemCommand, {
      nodeType: 'footnote',
      commandGroup: 'context'
    })
    config.addCommand('insert-inline-graphic', InsertInlineGraphicCommand, {
      nodeType: 'inline-graphic',
      commandGroup: 'additional'
    })
    config.addCommand('insert-table', InsertTableCommand, {
      nodeType: 'table-figure',
      commandGroup: 'insert'
    })
    config.addCommand('insert-formula', InsertInlineFormulaCommand, {
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

    config.addLabel('cite', 'Cite')
    config.addLabel('insert', 'Insert')
    config.addLabel('insert-xref-bibr', 'Reference')
    config.addLabel('insert-xref-fig', 'Figure')
    config.addLabel('insert-xref-table', 'Table')
    config.addLabel('insert-xref-fn', 'Footnote')
    config.addLabel('insert-xref-formula', 'Formula')
    config.addLabel('insert-xref-file', 'Supplementary File')
    config.addLabel('insert-disp-formula', 'Block Formula')
    config.addLabel('insert-disp-quote', 'Blockquote')
    config.addLabel('insert-footnote', 'Footnote')
    config.addLabel('remove-footnote', 'Remove Footnote')

    config.addLabel('manuscript-start', 'Article starts here')
    config.addLabel('manuscript-end', 'Article ends here')
    config.addLabel('sig-block-start', 'Signature Block starts here')
    config.addLabel('sig-block-end', 'Signature Block ends here')

    config.addLabel('insert-rows-above', {
      en: 'Insert ${nrows} rows above'
    })
    config.addLabel('insert-rows-below', {
      en: 'Insert ${nrows} rows below'
    })
    config.addLabel('insert-columns-left', {
      en: 'Insert ${ncols} columns left'
    })
    config.addLabel('insert-columns-right', {
      en: 'Insert ${ncols} columns right'
    })
    config.addLabel('delete-rows', {
      en: 'Delete ${nrows} rows'
    })
    config.addLabel('delete-columns', {
      en: 'Delete ${ncols} columns'
    })
    config.addLabel('toggle-cell-heading', {
      en: 'Cell heading'
    })
    config.addLabel('toggle-cell-merge', {
      en: 'Merge cell'
    })

    // Tools
    config.addTool('edit-xref', EditXrefTool)

    config.addTool('insert-fig', InsertFigureTool)
    config.addDropHandler(DropFigure)
    config.addLabel('insert-fig', 'Figure')
    config.addIcon('insert-fig', { 'fontawesome': 'fa-image' })

    config.addTool('add-figure-panel', InsertFigurePanelTool)
    config.addLabel('add-figure-panel', 'Add Sub-Figure')
    config.addIcon('add-figure-panel', { 'fontawesome': 'fa-upload' })

    config.addTool('replace-figure-panel-image', ReplaceFigurePanelTool)
    config.addLabel('replace-figure-panel-image', 'Replace Sub-Figure Image')
    config.addIcon('replace-figure-panel-image', { 'fontawesome': 'fa-file-image-o' })

    config.addLabel('remove-figure-panel', 'Remove Sub-Figure')
    config.addIcon('remove-figure-panel', { 'fontawesome': 'fa-trash' })

    config.addLabel('move-up-figure-panel', 'Move Up Sub-Figure')
    config.addIcon('move-up-figure-panel', { 'fontawesome': 'fa-caret-square-o-up' })

    config.addLabel('move-down-figure-panel', 'Move Down Sub-Figure')
    config.addIcon('move-down-figure-panel', { 'fontawesome': 'fa-caret-square-o-down' })

    config.addTool('insert-supplementary-file', InsertSupplementaryFileTool)
    config.addLabel('insert-supplementary-file', 'Supplementary File')
    config.addIcon('insert-supplementary-file', { 'fontawesome': 'fa-file-o' })

    config.addTool('replace-supplementary-file', ReplaceSupplementaryFileTool)
    config.addLabel('replace-supplementary-file', 'Replace Supplementary File')
    config.addIcon('replace-supplementary-file', { 'fontawesome': 'fa-file-text' })

    config.addTool('insert-inline-graphic', InsertInlineGraphicTool)
    config.addLabel('insert-inline-graphic', 'Inline Graphic')
    config.addIcon('insert-inline-graphic', { 'fontawesome': 'fa-line-chart' })

    config.addTool('insert-table', InsertTableTool)
    config.addLabel('insert-table', 'Table')

    config.addIcon('remove-footnote', { 'fontawesome': 'fa-trash' })

    config.addTool('edit-block-formula', EditDispFormulaTool)
    config.addTool('edit-formula', EditInlineFormulaTool)
    config.addLabel('insert-formula', 'Formula')

    config.addIcon('toggle-cell-merge', {
      'fontawesome': 'fa-arrows-h'
    })
    config.addIcon('toggle-cell-heading', { 'fontawesome': 'fa-th-large' })

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
    config.addCommand('toggle-unordered-list', ToggleListCommand, {
      spec: { listType: 'bullet' },
      commandGroup: 'list'
    })
    config.addKeyboardShortcut('CommandOrControl+Shift+8', { command: 'toggle-unordered-list' })
    config.addLabel('toggle-unordered-list', {
      en: 'Bulleted list',
      de: 'Liste'
    })
    config.addIcon('toggle-unordered-list', { 'fontawesome': 'fa-list-ul' })

    config.addCommand('toggle-ordered-list', ToggleListCommand, {
      spec: { listType: 'order' },
      commandGroup: 'list'
    })
    config.addKeyboardShortcut('CommandOrControl+Shift+7', { command: 'toggle-ordered-list' })
    config.addLabel('toggle-ordered-list', {
      en: 'Numbered list',
      de: 'Aufzählung'
    })
    config.addIcon('toggle-ordered-list', { 'fontawesome': 'fa-list-ol' })

    config.addCommand('indent-list', ListPackage.IndentListCommand, {
      spec: { action: 'indent' },
      commandGroup: 'list'
    })
    config.addLabel('indent-list', {
      en: 'Increase indentation',
      de: 'Einrückung vergrößern'
    })
    config.addIcon('indent-list', { 'fontawesome': 'fa-indent' })

    config.addCommand('dedent-list', ListPackage.IndentListCommand, {
      spec: { action: 'dedent' },
      commandGroup: 'list'
    })
    config.addLabel('dedent-list', {
      en: 'Decrease indentation',
      de: 'Einrückung verringern'
    })
    config.addIcon('dedent-list', { 'fontawesome': 'fa-dedent' })

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

    config.addToolPanel('table-context-menu', [
      {
        name: 'table-tools',
        type: 'group',
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'table' }
        ]
      },
      { type: 'separator' },
      {
        name: 'table-insert',
        type: 'group',
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'table-insert' }
        ]
      },
      { type: 'separator' },
      {
        name: 'table-delete',
        type: 'group',
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'table-delete' }
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

    // Workflows
    config.addComponent('add-reference', AddReferenceWorkflow)
    config.addLabel('add-reference-title', 'Add Reference(s)')
    config.addLabel('add-ref-manually', 'Or create manually')
    config.addLabel('fetch-datacite', 'Fetch from DataCite')
    config.addLabel('enter-doi-placeholder', 'Enter one or more DOIs')
    config.addLabel('doi-fetch-action', 'Add')
    config.addLabel('import-refs', 'Import')
    config.addLabel('supported-ref-formats', 'Supported formats')
    config.addComponent('edit-reference', EditReferenceWorkflow)

    config.addIcon('pencil', {
      'fontawesome': 'fa-pencil'
    })

    config.addIcon('trash', {
      'fontawesome': 'fa-trash'
    })
  },
  ManuscriptEditor,
  // legacy
  Editor: ManuscriptEditor
}
