import {
  Document,
  AnnotationCommand,
  BasePackage
} from 'substance'

import {
  Body, Emphasis, Strong, Subscript, Superscript
} from './RichTextInputModel'

import RichTextInputImporter from './RichTextInputImporter'
import RichTextInputExporter from './RichTextInputExporter'

import {
  StrongComponent,
  EmphasisComponent,
  SuperscriptComponent,
  SubscriptComponent
} from './RichTextComponents'

export default {
  name: 'rich-text-input',
  configure: function(config) {
    config.defineSchema({
      name: 'rich-text-input',
      DocumentClass: Document,
      version: '1.0.0'
    })

    config.import(BasePackage)

    // Body
    config.addNode(Body)
    config.addConverter('html', {
      type: 'body',
      tagName: 'body',
      import: function(el, node, converter) {
        node.id = 'body'
        node.content = converter.annotatedText(el, [node.id, 'content'])
      },
      export: function(node, el, converter) {
        el.append(converter.annotatedText([node.id, 'content']))
      }
    })

    // Emphasis
    config.addNode(Emphasis)
    config.addConverter('html', {
      type: 'emphasis',
      tagName: 'em'
    })
    config.addComponent('emphasis', EmphasisComponent)
    config.addCommand('emphasis', AnnotationCommand, {
      nodeType: 'emphasis',
      commandGroup: 'annotations'
    })
    config.addIcon('emphasis', { 'fontawesome': 'fa-italic' })
    config.addLabel('emphasis', 'Emphasis')

    // Strong
    config.addNode(Strong)
    config.addConverter('html', {
      type: 'strong',
      tagName: 'strong'
    })
    config.addComponent('strong', StrongComponent)
    config.addCommand('strong', AnnotationCommand, {
      nodeType: 'strong',
      commandGroup: 'annotations'
    })
    config.addIcon('strong', { 'fontawesome': 'fa-bold' })
    config.addLabel('strong', 'Strong')

    // Subscript
    config.addNode(Subscript)
    config.addConverter('html', {
      type: 'subscript',
      tagName: 'sub'
    })
    config.addComponent('subscript', SubscriptComponent)
    config.addCommand('subscript', AnnotationCommand, {
      nodeType: 'subscript',
      commandGroup: 'annotations'
    })
    config.addIcon('subscript', { 'fontawesome': 'fa-subscript' })
    config.addLabel('subscript', 'Subscript')

    // Superscript
    config.addNode(Superscript)
    config.addConverter('html', {
      type: 'superscript',
      tagName: 'sup'
    })
    config.addComponent('superscript', SuperscriptComponent)
    config.addCommand('superscript', AnnotationCommand, {
      nodeType: 'superscript',
      commandGroup: 'annotations'
    })
    config.addIcon('superscript', { 'fontawesome': 'fa-superscript' })
    config.addLabel('superscript', 'Superscript')

    // Keyboard shortcuts
    config.addKeyboardShortcut('CommandOrControl+B', { command: 'strong' })
    config.addKeyboardShortcut('CommandOrControl+I', { command: 'emphasis' })

    config.addImporter('html', RichTextInputImporter)
    config.addExporter('html', RichTextInputExporter)

    config.addToolPanel('main-overlay', [
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: false,
        commandGroups: ['annotations']
      }
    ])
  }
}
