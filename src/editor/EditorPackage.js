import {
  BasePackage as SubstanceBasePackage,
  MultiSelectPackage,
  FindAndReplacePackage,
  TextPropertyEditor,
  EditInlineNodeCommand,
  EditAnnotationCommand,
  SchemaDrivenCommandManager,
  substanceGlobals
} from 'substance'

import EntityLabelsPackage from '../entities/EntityLabelsPackage'
import EntityComponentsPackage from '../entities/EntityComponentsPackage'
import TextureArticlePackage from '../article/TextureArticlePackage'

import Editor from './components/Editor'
import TextNodeComponent from './components/TextNodeComponent'
import PlainTextComponent from './components/PlainTextComponent'
import UnsupportedNodeComponent from './components/UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './components/UnsupportedInlineNodeComponent'

import AbstractComponent from './components/AbstractComponent'
import AffiliationsListComponent from './components/AffiliationsListComponent'
import AuthorsListComponent from './components/AuthorsListComponent'
import EditorsListComponent from './components/EditorsListComponent'
import BackComponent from './components/BackComponent'
import BodyComponent from './components/BodyComponent'
import BreakComponent from './components/BreakComponent'
import ContainerNodeComponent from './components/ContainerNodeComponent'
import ElementNodeComponent from './components/ElementNodeComponent'
import EditXrefTool from './components/EditXrefTool'
import EditExtLinkTool from './components/EditExtLinkTool'
import FigComponent from './components/FigComponent'
import CaptionComponent from './components/CaptionComponent'
import FrontComponent from './components/FrontComponent'
import GraphicComponent from './components/GraphicComponent'
import DispQuoteComponent from './components/DispQuoteComponent'
import InlineFormulaComponent from './components/InlineFormulaComponent'
import TableCellComponent from './components/TableCellComponent'
import HeadingComponent from './components/HeadingComponent'
import ManuscriptComponent from './components/ManuscriptComponent'
import TOC from './components/TOC'
import TranslationsComponent from './components/TranslationsComponent'
import FnGroupComponent from './components/FnGroupComponent'
import FnComponent from './components/FnComponent'
import RefListComponent from './components/RefListComponent'
import RefComponent from './components/RefComponent'
import SeparatorComponent from './components/SeparatorComponent'
import SigBlockComponent from './components/SigBlockComponent'
import TitleGroupComponent from './components/TitleGroupComponent'
import XrefComponent from './components/XrefComponent'

import RefPreview from './components/RefPreview'
import FnPreview from './components/FnPreview'
import FigPreview from './components/FigPreview'
import TableFigPreview from './components/TableFigPreview'

import DecreaseHeadingLevelCommand from './commands/DecreaseHeadingLevelCommand'
import IncreaseHeadingLevelCommand from './commands/IncreaseHeadingLevelCommand'
import InsertExtLinkCommand from './commands/InsertExtLinkCommand'
import InsertDispQuoteCommand from './commands/InsertDispQuoteCommand'
import InsertXrefCommand from './commands/InsertXrefCommand'
import ToggleContentSection from './commands/ToggleContentSection'
import InsertFigureCommand from './commands/InsertFigureCommand'
import InsertFigureTool from './components/InsertFigureTool'
import DropFigure from './commands/DropFigure'
import InsertInlineFormulaCommand from './commands/InsertInlineFormulaCommand'
import EditInlineFormulaTool from './components/EditInlineFormulaTool'

import InsertTableCommand from './commands/InsertTableCommand'
import InsertTableTool from './components/InsertTableTool'

import InsertColumnCommand from './commands/InsertColumnCommand'
import InsertRowCommand from './commands/InsertRowCommand'
import RemoveColumnCommand from './commands/RemoveColumnCommand'
import RemoveRowCommand from './commands/RemoveRowCommand'

substanceGlobals.DEBUG_RENDERING = true

export default {
  name: 'author',
  configure(config) {
    config.import(SubstanceBasePackage)
    config.import(FindAndReplacePackage, {
      rootElement: '.sc-article'
    })
    config.import(MultiSelectPackage)
    config.import(EntityLabelsPackage)
    config.import(EntityComponentsPackage)
    config.import(TextureArticlePackage)

    // EXPERIMENTAL:
    // a CommandManager that uses the xmlSchema to inhibit commands
    // which would generate disallowed content
    config.setCommandManagerClass(SchemaDrivenCommandManager)

    // Experimental
    config.setLabelGenerator('references', {
      template: '[$]',
      and: ',',
      to: '-',
    })
    config.setLabelGenerator('figures', {
      name: 'Figure',
      plural: 'Figures',
      and: ',',
      to: '-',
    })
    config.setLabelGenerator('tables', {
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-',
    })
    config.setLabelGenerator('footnotes', {
      template: '$',
      and: ',',
      to: '-',
    })

    // Base functionality
    config.addComponent('text-node', TextNodeComponent)
    config.addComponent('text-property-editor', TextPropertyEditor)
    config.addComponent('plain-text-property', PlainTextComponent)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)

    // Node components
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('affiliations-list', AffiliationsListComponent)
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('editors-list', EditorsListComponent)
    config.addComponent('translations', TranslationsComponent)
    config.addComponent('back', BackComponent)
    config.addComponent('body', BodyComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('col', ElementNodeComponent)
    config.addComponent('colgroup', ElementNodeComponent)
    config.addComponent('disp-quote', DispQuoteComponent)
    config.addComponent('front', FrontComponent)
    config.addComponent('fig', FigComponent)
    config.addComponent('fn', FnComponent)
    config.addComponent('fn-group', FnGroupComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('ref', RefComponent)
    config.addComponent('ref-list', RefListComponent)
    config.addComponent('separator', SeparatorComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table', ElementNodeComponent)
    config.addComponent('table-wrap', FigComponent)
    config.addComponent('tbody', ElementNodeComponent)
    config.addComponent('td', TableCellComponent)
    config.addComponent('tfoot', ElementNodeComponent)
    config.addComponent('th', TableCellComponent)
    config.addComponent('thead', ElementNodeComponent)
    config.addComponent('title-group', TitleGroupComponent)
    config.addComponent('toc', TOC)
    config.addComponent('tr', ElementNodeComponent)
    config.addComponent('xref', XrefComponent)

    // Panels and other displays
    config.addComponent('manuscript', ManuscriptComponent)

    // Preview components for Ref, Fn, Figure
    config.addComponent('ref-preview', RefPreview)
    config.addComponent('fn-preview', FnPreview)
    config.addComponent('fig-preview', FigPreview)
    config.addComponent('table-wrap-preview', TableFigPreview)

    // Commands

    config.addCommand('toggle-abstract', ToggleContentSection, {
      selector: '.sc-abstract',
      commandGroup: 'toggle-content-section'
    })

    config.addCommand('toggle-authors', ToggleContentSection, {
      selector: '.sc-authors-list',
      commandGroup: 'toggle-content-section'
    })

    config.addCommand('toggle-references', ToggleContentSection, {
      selector: '.sc-ref-list',
      commandGroup: 'toggle-content-section'
    })

    config.addCommand('toggle-footnotes', ToggleContentSection, {
      selector: '.sc-fn-group',
      commandGroup: 'toggle-content-section'
    })

    config.addCommand('edit-xref', EditInlineNodeCommand, {
      nodeType: 'xref',
      commandGroup: 'prompt'
    })
    config.addCommand('insert-xref-bibr', InsertXrefCommand, {
      refType: 'bibr',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-fig', InsertXrefCommand, {
      refType: 'fig',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-table', InsertXrefCommand, {
      refType: 'table',
      commandGroup: 'insert-xref'
    })
    config.addCommand('insert-xref-fn', InsertXrefCommand, {
      refType: 'fn',
      commandGroup: 'insert-xref'
    })

    config.addCommand('insert-disp-quote', InsertDispQuoteCommand, {
      nodeType: 'disp-quote',
      commandGroup: 'insert'
    })
    config.addCommand('insert-fig', InsertFigureCommand, {
      nodeType: 'fig',
      commandGroup: 'insert'
    })
    config.addCommand('insert-table', InsertTableCommand, {
      nodeType: 'table-wrap',
      commandGroup: 'insert'
    })
    config.addCommand('insert-formula', InsertInlineFormulaCommand, {
      commandGroup: 'insert'
    })
    config.addCommand('edit-formula', EditInlineNodeCommand, {
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

    config.addCommand('insert-column', InsertColumnCommand, {
      commandGroup: 'table-modifiers'
    })
    config.addCommand('insert-row', InsertRowCommand, {
      commandGroup: 'table-modifiers'
    })
    config.addCommand('remove-column', RemoveColumnCommand, {
      commandGroup: 'table-modifiers'
    })
    config.addCommand('remove-row', RemoveRowCommand, {
      commandGroup: 'table-modifiers'
    })

    config.addLabel('cite', 'Cite')
    config.addLabel('insert-xref-bibr', 'Reference')
    config.addLabel('insert-xref-fig', 'Figure')
    config.addLabel('insert-xref-table', 'Table')
    config.addLabel('insert-xref-fn', 'Footnote')
    config.addLabel('insert-disp-quote', 'Blockquote')

    config.addLabel('manuscript-start', 'Article starts here')
    config.addLabel('manuscript-end', 'Article ends here')
    config.addLabel('sig-block-start', 'Signature Block starts here')
    config.addLabel('sig-block-end', 'Signature Block ends here')


    config.addLabel('view', 'View')
    config.addLabel('toggle-abstract', '${showOrHide} Abstract')
    config.addLabel('toggle-authors', '${showOrHide} Authors')
    config.addLabel('toggle-references', '${showOrHide} References')
    config.addLabel('toggle-footnotes', '${showOrHide} Footnotes')

    config.addLabel('insert-column', 'Insert column')
    config.addLabel('insert-row', 'Insert row')
    config.addLabel('remove-column', 'Remove column')
    config.addLabel('remove-row', 'Remove row')

    config.addLabel('add-reference-title', 'Add Reference(s)')
    config.addLabel('add-ref-manually', 'Or create manually')
    config.addLabel('fetch-datacite', 'Fetch from DataCite')
    config.addLabel('enter-doi-placeholder', 'Enter one or more DOIs')
    config.addLabel('doi-fetch-action', 'Add')
    config.addLabel('import-refs', 'Import')
    config.addLabel('supported-ref-formats', 'Supported formats')

    // Tools
    config.addTool('edit-xref', EditXrefTool)

    config.addTool('insert-fig', InsertFigureTool)
    config.addDropHandler(DropFigure)
    config.addLabel('insert-fig', 'Figure')
    config.addIcon('insert-fig', { 'fontawesome': 'fa-image' })

    config.addTool('insert-table', InsertTableTool)
    config.addLabel('insert-table', 'Table')
    config.addIcon('insert-table', { 'fontawesome': 'fa-table' })

    config.addTool('edit-formula', EditInlineFormulaTool)
    config.addLabel('insert-formula', 'Formula')
    config.addIcon('insert-formula', { 'fontawesome': 'fa-dollar' })

    config.addIcon('insert-disp-quote', { 'fontawesome': 'fa-quote-right' })

    // Annotation tools
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
      name: 'ext-link',
      nodeType: 'ext-link',
      commandGroup: 'formatting',
      command: InsertExtLinkCommand,
      icon: 'fa-link',
      label: 'Link',
      accelerator: 'CommandOrControl+K'
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
        type: 'p'
      },
      icon: 'fa-paragraph',
      label: 'Paragraph',
      accelerator: 'CommandOrControl+Alt+0'
    })

    config.addCommand('edit-ext-link', EditAnnotationCommand, {
      nodeType: 'ext-link',
      commandGroup: 'prompt'
    })

    // ExtLink
    config.addTool('edit-ext-link', EditExtLinkTool)
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' })
    config.addLabel('open-link', 'Open Link')

    // Declarative spec for tool display
    config.addToolPanel('toolbar', [
      {
        name: 'undo-redo',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['undo-redo']
      },
      {
        name: 'text-types',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'descriptive',
        commandGroups: ['text-types']
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['formatting']
      },
      {
        name: 'additinal-tools',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['insert']
      },
      {
        name: 'cite',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'descriptive',
        commandGroups: ['insert-xref']
      },
      {
        name: 'view',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'descriptive',
        commandGroups: ['toggle-content-section', 'view']
      }
    ])

    config.addToolPanel('main-overlay', [
      {
        name: 'prompt',
        type: 'tool-prompt',
        showDisabled: false,
        commandGroups: ['prompt']
      }
    ])

    config.addToolPanel('context-menu', [
      {
        name: 'context-menu',
        type: 'tool-group',
        showDisabled: false,
        style: 'descriptive',
        commandGroups: ['table-modifiers']
      }
    ])

    config.addToolPanel('workflow', [
      {
        name: 'workflow',
        type: 'tool-group',
        commandGroups: ['workflows']
      }
    ])

    // Labels for manuscript parts
    config.addLabel('references', 'References')

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

    /*
      Define panel structure
    */
    config.setPanelsSpec([
      { group: 'structure' },
      { panel: 'toc' },
      { group: 'article-info' },
      // { panel: 'contributors' },
      // { panel: 'affiliations' },
      { panel: 'translations' },
      { group: 'pub-data' },
      { panel: 'article-record' }
    ])
  },
  Editor
}
