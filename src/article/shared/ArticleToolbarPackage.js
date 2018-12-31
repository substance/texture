export default {
  name: 'article-toolbar',
  configure (config) {
    config.addToolPanel('toolbar', [
      {
        name: 'document-tools',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'undo' },
          { type: 'command', name: 'redo' },
          { type: 'command', name: 'save' }
        ]
      },
      {
        name: 'primary-annotations',
        type: 'group',
        style: 'minimal',
        items: [
          { type: 'command', name: 'toggle-bold', label: 'bold', icon: 'bold' },
          { type: 'command', name: 'toggle-italic', label: 'italic', icon: 'italic' },
          { type: 'command', name: 'create-ext-link', label: 'link', icon: 'link' }
        ]
      },
      {
        name: 'insert',
        type: 'dropdown',
        style: 'descriptive',
        items: [
          { type: 'command', name: 'insert-figure', label: 'insert-figure' },
          { type: 'command', name: 'insert-image', label: 'insert-image' },
          { type: 'command', name: 'insert-table', label: 'insert-table' },
          { type: 'command', name: 'insert-block-quote', label: 'insert-block-quote' },
          { type: 'command', name: 'insert-block-formula', label: 'insert-equation' },
          { type: 'command', name: 'insert-file', label: 'insert-file' },
          { type: 'command', name: 'insert-footnote', label: 'insert-footnote' },
          { type: 'command', name: 'insert-reference', label: 'insert-reference' },
          { type: 'separator', label: 'inline' },
          { type: 'command', name: 'insert-inline-formula', label: 'math' },
          { type: 'command', name: 'insert-inline-graphic', label: 'inline-graphic' },
          { type: 'command', name: 'create-link', label: 'external-link' },
          { type: 'command', name: 'insert-xref-bibr', label: 'citation' },
          { type: 'command', name: 'insert-xref-figure', label: 'figure-reference' },
          { type: 'command', name: 'insert-xref-table', label: 'table-reference' },
          { type: 'command', name: 'insert-xref-footnote', label: 'footnote-reference' },
          { type: 'command', name: 'insert-xref-file', label: 'file-reference' },
          { type: 'separator', label: 'metadata' },
          { type: 'command', name: 'add-author', label: 'author' },
          { type: 'command', name: 'add-editor', label: 'editor' },
          { type: 'command', name: 'add-group', label: 'group' },
          { type: 'command', name: 'add-affiliation', label: 'affiliation' },
          { type: 'command', name: 'add-award', label: 'award' },
          { type: 'command', name: 'add-keyword', label: 'keyword' },
          { type: 'command', name: 'add-subject', label: 'subject' }
        ]
      },
      // TODO: not sure yet. This could also be seen as a contextual thing
      {
        name: 'format',
        type: 'dropdown',
        style: 'descriptive',
        items: [
          { type: 'command', name: 'toggle-bold', label: 'bold' },
          { type: 'command', name: 'toggle-italic', label: 'italic' },
          { type: 'command', name: 'toggle-subscript', label: 'subscript' },
          { type: 'command', name: 'toggle-superscript', label: 'superscript' },
          { type: 'command', name: 'toggle-monospace', label: 'monospace' },
          { type: 'command', name: 'toggle-small-caps', label: 'small-caps' },
          { type: 'command', name: 'toggle-underline', label: 'underline' },
          { type: 'command', name: 'toggle-overline', label: 'overline' },
          { type: 'command', name: 'toggle-strike-through', label: 'strike-through' }
        ]
      },
      // Contextual stuff
      {
        name: 'text-types',
        type: 'dropdown',
        style: 'descriptive',
        hideDisabled: true,
        displayActiveCommand: true,
        items: [
          { type: 'command-group', name: 'text-types' }
        ]
      },
      // TODO: we do not have a good concept for contextual tools
      // we considered to have a toolgroup which renders the context as a label
      // As we do not have such a thing, the closest we can get there
      // are drop-down menues which are visible only when enabled
      {
        name: 'table-tools',
        type: 'dropdown',
        style: 'descriptive',
        hideDisabled: true,
        items: [
          { type: 'command-group', name: 'table' },
          { type: 'command-group', name: 'table-insert' },
          { type: 'command-group', name: 'table-delete' }
        ]
      },
      {
        name: 'list-tools',
        type: 'dropdown',
        style: 'descriptive',
        hideDisabled: true,
        items: [
          { type: 'command-group', name: 'list' }
        ]
      },
      {
        name: 'mode',
        type: 'dropdown',
        style: 'full',
        hideDisabled: true,
        items: [
          { type: 'command', name: 'open-manuscript', label: 'manuscript' },
          { type: 'command', name: 'open-metadata', label: 'metadata' }
        ]
      }
    ])

    // Icons
    config.addIcon('bold', { 'fontawesome': 'fa-bold' })
    config.addIcon('italic', { 'fontawesome': 'fa-italic' })
    config.addIcon('link', { 'fontawesome': 'fa-link' })

    // Labels
    config.addLabel('bold', 'Bold')
    config.addLabel('italic', 'Italic')
    config.addLabel('link', 'Link')
    config.addLabel('subscript', 'Subscript')
    config.addLabel('superscript', 'Superscript')
    config.addLabel('monospace', 'Monospace')
    config.addLabel('format', 'Format')
    config.addLabel('list-tools', 'List')
    config.addLabel('insert-figure', 'Figure')
    config.addLabel('insert-table', 'Table')
    config.addLabel('insert-block-quote', 'Block Quote')
    config.addLabel('insert-equation', 'Equation')
    config.addLabel('insert-file', 'File')
    config.addLabel('insert-footnote', 'Footnote')
    config.addLabel('table-tools', 'Table')
  }
}
