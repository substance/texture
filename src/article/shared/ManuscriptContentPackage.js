import { AnnotationComponent } from '../../kit'

import AbstractComponent from './AbstractComponent'
import AuthorsListComponent from './AuthorsListComponent'
import BreakComponent from './BreakComponent'
import BlockFormulaComponent from './BlockFormulaComponent'
import BlockQuoteComponent from './BlockQuoteComponent'
import CustomMetadataFieldComponent from './CustomMetadataFieldComponent'
import ExternalLinkComponent from './ExternalLinkComponent'
import FigureComponent from './FigureComponent'
import FigurePanelComponent from './FigurePanelComponent'
import FootnoteComponent from './FootnoteComponent'
import HeadingComponent from './HeadingComponent'
import InlineFormulaComponent from './InlineFormulaComponent'
import InlineGraphicComponent from './InlineGraphicComponent'
import ListComponent from './ListComponent'
import ListItemComponent from './ListItemComponent'
import ManuscriptComponent from './ManuscriptComponent'
import ModelPreviewComponent from './ModelPreviewComponent'
import ParagraphComponent from './ParagraphComponent'
import ReferenceComponent from './ReferenceComponent'
import ReferenceListComponent from './ReferenceListComponent'
import SectionLabel from './SectionLabel'
import TableComponent from './TableComponent'
import TableFigureComponent from './TableFigureComponent'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import XrefComponent from './XrefComponent'
import DefaultNodeComponent from './DefaultNodeComponent'
import GraphicComponent from './GraphicComponent'
import SupplementaryFileComponent from './SupplementaryFileComponent'

export default {
  name: 'manuscript-content',
  configure (config) {
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('bold', AnnotationComponent)
    config.addComponent('block-formula', BlockFormulaComponent)
    config.addComponent('block-quote', BlockQuoteComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('custom-metadata-field', CustomMetadataFieldComponent)
    config.addComponent('external-link', ExternalLinkComponent)
    config.addComponent('figure', FigureComponent)
    config.addComponent('figure-panel', FigurePanelComponent)
    config.addComponent('footnote', FootnoteComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('inline-graphic', InlineGraphicComponent)
    config.addComponent('italic', AnnotationComponent)
    config.addComponent('list', ListComponent)
    config.addComponent('list-item', ListItemComponent)
    config.addComponent('manuscript', ManuscriptComponent)
    config.addComponent('monospace', AnnotationComponent)
    config.addComponent('paragraph', ParagraphComponent)
    config.addComponent('reference', ReferenceComponent)
    config.addComponent('reference-list', ReferenceListComponent)
    config.addComponent('section-label', SectionLabel)
    config.addComponent('subscript', AnnotationComponent)
    config.addComponent('superscript', AnnotationComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('table-figure', TableFigureComponent)
    config.addComponent('unsupported-node', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)
    config.addComponent('xref', XrefComponent)

    config.addComponent('graphic', GraphicComponent)
    config.addComponent('supplementary-file', SupplementaryFileComponent)

    // TODO: either we use DefaultNodeComponent generally, but with better control over the look-and-feel
    // or we use it only in Metadata Editor, or in popups.
    // binding to 'entity' sounds no appropriate anymore, because we do not have the concept of 'Entity' anymore
    config.addComponent('entity', DefaultNodeComponent)
    config.addComponent('model-preview', ModelPreviewComponent)

    config.addLabel('abstract-label', 'Abstract')
    config.addLabel('abstract-placeholder', 'Enter abstract')
    config.addLabel('authors-label', 'Authors')
    config.addLabel('body-label', 'Main text')
    config.addLabel('body-placeholder', 'Write your article here.')
    config.addLabel('caption-label', 'Caption')
    config.addLabel('caption-placeholder', 'Enter caption')
    config.addLabel('metadata-label', 'Metadata')
    config.addLabel('footnote-placeholder', 'Enter footnote')
    config.addLabel('footnotes-label', 'Footnotes')
    config.addLabel('label-label', 'Label')
    config.addLabel('references-label', 'References')
    config.addLabel('title-label', 'Title')
    config.addLabel('title-placeholder', 'Enter title')

    // Used for rendering warning in case of missing images
    config.addIcon('graphic-load-error', { 'fontawesome': 'fa-warning' })
    config.addLabel('graphic-load-error', 'We couldn\'t load an image, sorry.')
  }
}
