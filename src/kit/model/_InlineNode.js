import { AnnotationMixin } from 'substance'
import DocumentNode from './_DocumentNode'

/*
 ATTENTION: this is a preliminary extension of the Substance.InlineNode
 After consolidation this will be merged into Substance.
*/
export default class InlineNode extends AnnotationMixin(DocumentNode) {
  static isInlineNode () { return true }
}
