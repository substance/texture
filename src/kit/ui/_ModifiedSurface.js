export default function ModifiedSurface (Surface) {
  class _ModifiedSurface extends Surface {
    constructor (parent, props, options) {
      super(parent, _monkeyPatchSurfaceProps(parent, props), options)
    }

    setProps (newProps) {
      return super.setProps(_monkeyPatchSurfaceProps(this.parent, newProps))
    }
  }
  return _ModifiedSurface
}

function _monkeyPatchSurfaceProps (parent, props) {
  let newProps = Object.assign({}, props)
  if (props.model && !props.node) {
    const model = props.model
    switch (model.type) {
      case 'collection': {
        newProps.containerPath = model._path
        break
      }
      default: {
        // TODO: do we really need this anymore?
        if (model._node) {
          newProps.node = model._node
        }
      }
    }
  }
  return newProps
}
