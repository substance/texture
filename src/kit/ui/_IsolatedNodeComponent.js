import { IsolatedNodeComponent as SubstanceIsolatedNodeComponent } from 'substance'

/*
  This is overriding Substance.IsolatedInlineNodeComponent
    - to support Models.
    - to make all IsolatedNodeComponents 'open'
*/
export default class IsolatedNodeComponentNew extends SubstanceIsolatedNodeComponent {
  constructor (parent, props, options) {
    super(parent, props, options)
    if (!props.model) throw new Error("Property 'model' is required and must be a NodeModel")
    if (!props.model._node) throw new Error('Provided model must container a DocumentNode')

    // HACK: overriding 'closed' IsolatedNodeComponents per se
    // TODO: on the long term we need to understand if it may be better to open
    // IsolatedNodes by default and only close them if needed.
    // The UX is improved much also in browsers like FF.
    // Still we need to evaluate this decision in the near future.
    this.blockingMode = 'open'
  }

  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }

  // overriding the core implementation to select the node on all unhandled clicks.
  // Note: this caused a regression, because the original InlineNode component was letting events bubble up.
  onClick (event) {
    event.stopPropagation()
    event.preventDefault()
    this.selectNode()
  }
}
