import { IsolatedInlineNodeComponent as SubstanceIsolatedInlineNodeComponent } from 'substance'

/*
  This is overriding Substance.IsolatedInlineNodeComponent to support Models.
*/
export default class IsolatedInlineNodeComponentNew extends SubstanceIsolatedInlineNodeComponent {
  constructor (parent, props, options) {
    super(parent, props, options)
    if (!props.model) throw new Error("Property 'model' is required and must be a NodeModel")
    if (!props.model._node) throw new Error('Provided model must container a DocumentNode')
  }
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }
}
