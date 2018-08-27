import {
  BasePackage, EditorBasePackage, ModelComponentPackage
} from '../../kit'

import ArticleNavPackage from '../ArticleNavPackage'
import EntityLabelsPackage from '../shared/EntityLabelsPackage'
import ManuscriptContentPackage from '../shared/ManuscriptContentPackage'

import AddReferenceWorkflow from '../shared/AddReferenceWorkflow'
import AddEntityCommand from './AddEntityCommand'
import CollectionEditor from './CollectionEditor'
import ArticleRecordEditor from './ArticleRecordEditor'
import BibliographicEntryEditor from './BibliographicEntryEditor'
import TranslatableEntryEditor from './TranslatableEntryEditor'
import TranslateableEditor from './TranslateableEditor'

export default {
  name: 'ArticleMetadata',
  configure (config) {
    config.import(BasePackage)
    config.import(EditorBasePackage)
    config.import(ArticleNavPackage)
    config.import(ManuscriptContentPackage)
    config.import(ModelComponentPackage)
    config.import(EntityLabelsPackage)

    // sections and editors
    config.addComponent('collection', CollectionEditor)
    config.addComponent('article-record', ArticleRecordEditor)
    config.addComponent('bibr', BibliographicEntryEditor, true)
    config.addComponent('subject', TranslatableEntryEditor)
    config.addComponent('translatable', TranslateableEditor)
    config.addComponent('keyword', TranslatableEntryEditor)
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
    config.addLabel('workflows', {
      en: 'Workflows'
    })

    config.addCommand('add-author', AddEntityCommand, {
      type: 'author',
      collection: 'authors',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-editor', AddEntityCommand, {
      type: 'editor',
      collection: 'editors',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-group', AddEntityCommand, {
      type: 'group',
      collection: 'groups',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-organisation', AddEntityCommand, {
      type: 'organisation',
      collection: 'organisations',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-award', AddEntityCommand, {
      type: 'award',
      collection: 'awards',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-keyword', AddEntityCommand, {
      type: 'keyword',
      collection: 'keywords',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-subject', AddEntityCommand, {
      type: 'subject',
      collection: 'subjects',
      commandGroup: 'add-entity'
    })
    config.addCommand('add-footnote', AddEntityCommand, {
      type: 'fn',
      collection: 'footnotes',
      commandGroup: 'add-entity'
    })
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
      en: 'Organisation'
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
      en: 'Translation'
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
      en: 'Organisations'
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
  }
}
