/* eslint-disable no-template-curly-in-string */
import {
  AnnotationComponent,
  MultiSelectPackage
} from 'substance'

import {
  BasePackage, ModelComponentPackage,
  CompositeComponent, NodeModelComponent
} from '../../kit'

import ArticleNavPackage from '../ArticleNavPackage'
import EntityLabelsPackage from '../metadata/EntityLabelsPackage'

// new model based components
import ManuscriptComponent from '../shared/ManuscriptComponent'
import FrontMatterComponent from '../shared/FrontMatterComponent'
import ReferenceListComponent from '../shared/ReferenceListComponent'

// General components
import ElementNodeComponent from '../shared/ElementNodeComponent'
import UnsupportedNodeComponent from '../shared/UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from '../shared/UnsupportedInlineNodeComponent'

import AbstractComponent from '../shared/AbstractComponent'
import AuthorsListComponent from '../shared/AuthorsListComponent'
import BibliographicEntryComponent from '../shared/BibliographicEntryComponent'
import ExtLinkComponent from '../shared/ExtLinkComponent'
import FigureComponent from '../shared/FigureComponent'

// LEGACY: Node based components
import AffiliationsListComponent from '../editor/AffiliationsListComponent'
import BreakComponent from '../shared/BreakComponent'
import EditorsListComponent from '../editor/EditorsListComponent'
import CaptionComponent from '../shared/CaptionComponent'
import ContainerNodeComponent from '../shared/ContainerNodeComponent'
import DispQuoteComponent from '../editor/DispQuoteComponent'
import FnComponent from '../editor/FnComponent'
import FnGroupComponent from '../editor/FnGroupComponent'
import GraphicComponent from '../editor/GraphicComponent'
import HeadingComponent from '../editor/HeadingComponent'
import InlineFormulaComponent from '../shared/InlineFormulaComponent'
import ListComponent from '../editor/ListComponent'
import ListItemComponent from '../editor/ListItemComponent'
import SeparatorComponent from '../editor/SeparatorComponent'
import SigBlockComponent from '../editor/SigBlockComponent'
import TableComponent from '../editor/TableComponent'
import TitleGroupComponent from '../editor/TitleGroupComponent'
import TOC from '../editor/TOC'
import XrefComponent from '../editor/XrefComponent'
import FnPreview from '../editor/FnPreview'
import FigPreview from '../editor/FigPreview'
import TableFigPreview from '../editor/TableFigPreview'

export default {
  name: 'ArticleReader',
  configure (config) {
    config.import(BasePackage)
    config.import(ModelComponentPackage)

    config.import(MultiSelectPackage)
    config.import(EntityLabelsPackage)
    config.import(ArticleNavPackage)

    config.addComponent('front-matter', FrontMatterComponent)
    config.addComponent('back-matter', CompositeComponent)
    config.addComponent('references', ReferenceListComponent)
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('manuscript', ManuscriptComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)
    config.addComponent('bibr', BibliographicEntryComponent)

    // Some built-ins will be still based on nodes (particularly annotations)
    // ATTENTION: I have changed the behavior so that unregistered annotations or inline-nodes are
    // rendered using the UnsupportedInlineNodeComponent instead of rendering all by default with AnnotationComponent
    // This, we need to register AnnotationComponent explicitly for all annotations
    config.addComponent('bold', AnnotationComponent)
    config.addComponent('italic', AnnotationComponent)
    config.addComponent('sub', AnnotationComponent)
    config.addComponent('sup', AnnotationComponent)
    config.addComponent('monospace', AnnotationComponent)
    config.addComponent('ext-link', ExtLinkComponent)

    // LEGACY: Node based components to get our model based approach working with some 'old' stuff
    // TODO: try to get rid of any 'polyfill' and convert components into a Model based implementation
    config.addComponent('entity', NodeModelComponent)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('affiliations-list', AffiliationsListComponent)
    config.addComponent('editors-list', EditorsListComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('col', ElementNodeComponent)
    config.addComponent('colgroup', ElementNodeComponent)
    config.addComponent('disp-quote', DispQuoteComponent)
    config.addComponent('figure', FigureComponent)
    config.addComponent('table-figure', FigureComponent)
    config.addComponent('fn', FnComponent)
    config.addComponent('fn-group', FnGroupComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('list', ListComponent)
    config.addComponent('list-item', ListItemComponent)
    config.addComponent('separator', SeparatorComponent)
    config.addComponent('sig-block', SigBlockComponent)
    config.addComponent('table-wrap', FigureComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('title-group', TitleGroupComponent)
    config.addComponent('toc', TOC)
    config.addComponent('tr', ElementNodeComponent)
    config.addComponent('xref', XrefComponent)
    config.addComponent('fn-preview', FnPreview)
    config.addComponent('fig-preview', FigPreview)
    config.addComponent('table-wrap-preview', TableFigPreview)

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
    config.addLabel('article-info', 'Article Information')
    config.addLabel('article-record', 'Article Record')
    config.addLabel('contributors', 'Authors & Contributors')
    config.addLabel('edit-ref', 'Edit Reference')
    config.addLabel('no-authors', 'No Authors')
    config.addLabel('no-editors', 'No Editors')
    config.addLabel('no-references', 'No References')
    config.addLabel('no-footnotes', 'No Footnotes')
    config.addLabel('pub-data', 'Publication Data')
    config.addLabel('references', 'References')
    config.addLabel('structure', 'Structure')
    config.addLabel('toc', 'Table of Contents')
    config.addLabel('translations', 'Translations')

    config.addToolPanel('toolbar', [
      {
        name: 'mode',
        type: 'tool-dropdown',
        showDisabled: false,
        style: 'full',
        items: [
          { type: 'command-group', name: 'switch-view' }
        ]
      }
    ])
  }
}
