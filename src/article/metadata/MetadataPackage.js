import { AnnotationCommand } from 'substance'
import {
  BasePackage, EditorBasePackage, ModelComponentPackage, FindAndReplacePackage
} from '../../kit'

// Commands
import InsertExtLinkCommand from '../editor/InsertExtLinkCommand'

import ArticleNavPackage from '../ArticleNavPackage'
import ArticleToolbarPackage from '../shared/ArticleToolbarPackage'
import PersistencePackage from '../../PersistencePackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'

import AddReferenceWorkflow from '../shared/AddReferenceWorkflow'
import AddEntityCommand from './AddEntityCommand'
import ArticleRecordComponent from './ArticleRecordComponent'
import BibliographicEntryEditor from './BibliographicEntryEditor'
import { MoveCollectionItemCommand, RemoveCollectionItemCommand } from './CollectionCommands'
import {
  AddFigurePanelCommand, MoveFigurePanelCommand,
  ReplaceFigurePanelImageCommand, RemoveFigurePanelCommand
} from '../shared/FigurePanelCommands'
import { InsertFigurePanelTool, ReplaceFigurePanelTool } from '../shared/FigurePanelTools'
import FiguresSectionComponent from './FiguresSectionComponent'
import InsertFootnoteCommand from '../shared/InsertFootnoteCommand'
import MetadataSection from './MetadataSection'
import TableFigureComponent from '../shared/TableFigureComponent'
import TranslatableEntryEditor from './TranslatableEntryEditor'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ArticleToolbarPackage)
    config.import(ArticleNavPackage)
    config.import(PersistencePackage)
    config.import(ManuscriptContentPackage)
    config.import(ModelComponentPackage)
    config.import(EntityLabelsPackage)
    config.import(FindAndReplacePackage)

    // sections and editors
    config.addComponent('article-record', ArticleRecordComponent)
    config.addComponent('bibr', BibliographicEntryEditor, true)
    config.addComponent('table-figure', TableFigureComponent, true)
    config.addComponent('subject', TranslatableEntryEditor)
    config.addComponent('keyword', TranslatableEntryEditor)
    // Note: @figures and @tables are (dynamic) collections derived from the article's content
    config.addComponent('@figures', FiguresSectionComponent)
    config.addComponent('@tables', MetadataSection)

    // workflows
    config.addComponent('add-reference', AddReferenceWorkflow)

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
      commandGroup: 'contextual'
    })
    config.addTool('add-figure-panel', InsertFigurePanelTool)
    config.addLabel('add-figure-panel', 'Add Sub-Figure')
    config.addIcon('add-figure-panel', { 'fontawesome': 'fa-upload' })

    config.addCommand('replace-figure-panel-image', ReplaceFigurePanelImageCommand, {
      commandGroup: 'contextual'
    })
    config.addTool('replace-figure-panel-image', ReplaceFigurePanelTool)
    config.addLabel('replace-figure-panel-image', 'Replace Sub-Figure Image')
    config.addIcon('replace-figure-panel-image', { 'fontawesome': 'fa-file-image-o' })

    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'contextual'
    })
    config.addLabel('remove-figure-panel', 'Remove Sub-Figure')
    config.addIcon('remove-figure-panel', { 'fontawesome': 'fa-trash' })

    config.addCommand('move-up-figure-panel', MoveFigurePanelCommand, {
      direction: 'up',
      commandGroup: 'contextual'
    })
    config.addLabel('move-up-figure-panel', 'Move Up Sub-Figure')
    config.addIcon('move-up-figure-panel', { 'fontawesome': 'fa-caret-square-o-up' })

    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'contextual'
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
      commandGroup: 'contextual'
    })

    // Collections:

    registerCollectionCommand(config, 'author', ['metadata', 'authors'], { keyboardShortcut: 'CommandOrControl+Alt+A', nodeType: 'person' })
    registerCollectionCommand(config, 'award', ['metadata', 'awards'], { keyboardShortcut: 'CommandOrControl+Alt+Y' })
    registerCollectionCommand(config, 'editor', ['metadata', 'editors'], { keyboardShortcut: 'CommandOrControl+Alt+E', nodeType: 'person' })
    registerCollectionCommand(config, 'footnote', ['article', 'footnotes'], { automaticOrder: true, Command: InsertFootnoteCommand })
    registerCollectionCommand(config, 'group', ['metadata', 'groups'], { keyboardShortcut: 'CommandOrControl+Alt+G' })
    registerCollectionCommand(config, 'keyword', ['metadata', 'keywords'], { keyboardShortcut: 'CommandOrControl+Alt+K' })
    registerCollectionCommand(config, 'organisation', ['metadata', 'organisations'], { keyboardShortcut: 'CommandOrControl+Alt+O' })
    registerCollectionCommand(config, 'subject', ['metadata', 'subjects'])

    // FigurePanels work a little different than other collections, e.g. one can replace an image
    config.addCommand('add-figure-panel', AddFigurePanelCommand, {
      commandGroup: 'collection'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Up', { command: 'move-up-col-item' })
    config.addCommand('move-down-col-item', MoveCollectionItemCommand, {
      direction: 'down',
      commandGroup: 'contextual'
    })
    config.addTool('replace-figure-panel-image', ReplaceFigurePanelTool)
    config.addLabel('replace-figure-panel-image', 'Replace Sub-Figure Image')
    config.addIcon('replace-figure-panel-image', { 'fontawesome': 'fa-file-image-o' })

    config.addCommand('remove-figure-panel', RemoveFigurePanelCommand, {
      commandGroup: 'collection'
    })
    config.addKeyboardShortcut('CommandOrControl+Alt+Down', { command: 'move-down-col-item' })
    config.addCommand('remove-col-item', RemoveCollectionItemCommand, {
      commandGroup: 'contextual'
    })
    config.addLabel('move-up-figure-panel', 'Move Up Sub-Figure')
    config.addIcon('move-up-figure-panel', { 'fontawesome': 'fa-caret-square-o-up' })

    config.addCommand('move-down-figure-panel', MoveFigurePanelCommand, {
      direction: 'down',
      commandGroup: 'collection'
    })
    config.addLabel('move-down-figure-panel', 'Move Down Sub-Figure')
    config.addIcon('move-down-figure-panel', { 'fontawesome': 'fa-caret-square-o-down' })
  }
}

function registerCollectionCommand (config, itemType, collectionPath, options = {}) {
  let nodeType = options.nodeType || itemType
  let xpathSelector = collectionPath.join('.')
  let Command = options.Command || AddEntityCommand
  config.addCommand(`add-${itemType}`, Command, {
    type: nodeType,
    collection: collectionPath,
    commandGroup: 'add-entity'
  })
  if (options.keyboardShortcut) {
    config.addKeyboardShortcut(options.keyboardShortcut, { command: 'add-author' })
  }
  if (!config.automaticOrder) {
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
  }
  config.addIcon(`remove-${itemType}`, { 'fontawesome': 'fa-trash' })
  config.addLabel(`remove-${itemType}`, {
    en: 'Remove item'
  })
  config.addKeyboardShortcut('CommandOrControl+Alt+Delete', { command: `remove-${itemType}` })
}
