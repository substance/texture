
module.exports = {
  'paragraph': require('substance/packages/paragraph/ParagraphComponent'),
  'heading': require('substance/packages/heading/HeadingComponent'),
  'link': require('substance/packages/link/LinkComponent'),
  'codeblock': require('substance/packages/codeblock/CodeblockComponent'),
  'blockquote': require('substance/packages/blockquote/BlockquoteComponent'),
  'emphasis': require('substance/ui/AnnotationComponent'),
  'strong': require('substance/ui/AnnotationComponent'),
  'subscript': require('substance/ui/AnnotationComponent'),
  'superscript': require('substance/ui/AnnotationComponent'),
  'figure': require('./FigureComponent'),
  'table-wrap': require('./FigureComponent'),
  'reference': require('./ReferenceComponent'),
  'caption': require('./CaptionComponent'),
  'table': require('./TableComponent'),
  'graphic': require('./GraphicComponent'),
  'unsupported': require('./UnsupportedNodeComponent'),
};
