import { IsolatedNodeComponent as SubstanceIsolatedNodeComponent } from 'substance'

/*
  This is overriding Substance.IsolatedInlineNodeComponent
    - to support Models.
    - to make all IsolatedNodeComponents 'open'
*/
export default class IsolatedNodeComponentNew extends SubstanceIsolatedNodeComponent {
  constructor (parent, props, options) {
    super(parent, props, options)
    // HACK: overriding 'closed' IsolatedNodeComponents per se
    // TODO: on the long term we need to understand if it may be better to open
    // IsolatedNodes by default and only close them if needed.
    // The UX is improved much also in browsers like FF.
    // Still we need to evaluate this decision in the near future.
    this.blockingMode = 'open'
  }

  // overriding the core implementation to select the node on all unhandled clicks.
  // Note: this caused a regression, because the original InlineNode component was letting events bubble up.
  onClick (event) {
    event.stopPropagation()
    event.preventDefault()
    this.selectNode()
  }
}
