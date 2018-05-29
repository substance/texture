import {
  BasePackage as SubstanceBasePackage,
  ListPackage,
  TextPropertyEditor,
  TextPropertyComponent,
  SchemaDrivenCommandManager,
  substanceGlobals
} from 'substance'

import TextNodeComponent from '../editor/components/TextNodeComponent'
import PlainTextComponent from '../editor/components/PlainTextComponent'
import UnsupportedNodeComponent from '../editor/components/UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from '../editor/components/UnsupportedInlineNodeComponent'

import BreakComponent from '../editor/components/BreakComponent'
import ContainerNodeComponent from '../editor/components/ContainerNodeComponent'
import ElementNodeComponent from '../editor/components/ElementNodeComponent'
import FigComponent from '../editor/components/FigComponent'
import CaptionComponent from '../editor/components/CaptionComponent'
import FrontComponent from '../editor/components/FrontComponent'
import GraphicComponent from '../editor/components/GraphicComponent'
import DispQuoteComponent from '../editor/components/DispQuoteComponent'
import InlineFormulaComponent from '../editor/components/InlineFormulaComponent'
import TableComponent from '../editor/components/TableComponent'
import HeadingComponent from '../editor/components/HeadingComponent'
import TOC from '../editor/components/TOC'
import FnGroupComponent from '../editor/components/FnGroupComponent'
import FnComponent from '../editor/components/FnComponent'
import RefComponent from '../editor/components/RefComponent'
import SeparatorComponent from '../editor/components/SeparatorComponent'
import SigBlockComponent from '../editor/components/SigBlockComponent'
import XrefComponent from '../editor/components/XrefComponent'

import TextureArticlePackage from '../article/TextureArticlePackage'

import ArticleAbstractComponent from '../shared/components/ArticleAbstractComponent'
import ArticleBodyComponent from '../shared/components/ArticleBodyComponent'
import ArticleHeaderComponent from '../shared/components/ArticleHeaderComponent'
import ArticleReferencesComponent from '../shared/components/ArticleReferencesComponent'
import ArticleTitleComponent from '../shared/components/ArticleTitleComponent'
import ArticleContribsComponent from '../shared/components/ArticleContribsComponent'
import FigureComponent from '../shared/components/FigureComponent'




substanceGlobals.DEBUG_RENDERING = true

export default {
  name: 'reader',
  configure(config) {
    config.import(SubstanceBasePackage)
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
    config.addComponent('list', ListPackage.ListComponent)
    config.addComponent('list-item', TextPropertyComponent)
    config.addComponent('ref', RefComponent)
    config.addComponent('separator', SeparatorComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table-wrap', FigComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('toc', TOC)
    config.addComponent('tr', ElementNodeComponent)
    config.addComponent('xref', XrefComponent)
    config.addComponent('figure', FigureComponent)

    // New Shared Components
    config.addComponent('article-abstract', ArticleAbstractComponent)
    config.addComponent('article-body', ArticleBodyComponent)
    config.addComponent('article-contribs', ArticleContribsComponent)
    config.addComponent('article-header', ArticleHeaderComponent)
    config.addComponent('article-references', ArticleReferencesComponent)
    config.addComponent('article-title', ArticleTitleComponent)    

  }
}
