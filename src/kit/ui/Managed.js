import { Component } from 'substance'

const _ManagedComponentCache = new Map()

/*
  Example:
  ```
  $$(Managed(Toolbar), { bindings: ['commandState'] })
  ```
  `commandStates` will be taken from the app-state, and merged with the other props.
  When `commandStates` is changed, Toolbar automatically will be rerendered automatically via extendProps.
*/
export default function Managed (ComponentClass) {
  if (_ManagedComponentCache.has(ComponentClass)) return _ManagedComponentCache.get(ComponentClass)

  // an anonymous class that takes care of mapping props that start with $
  class ManagedComponent extends Component {
    constructor (...args) {
      super(...args)

      if (!this.context.appState) {
        throw new Error("'context.appState' is required for Managed Components.")
      }
      this._config = this._compileManagedProps(this.props)
      this._props = this._deriveManagedProps(this.props)
    }

    didMount () {
      if (this._config) {
        this._register()
      }
    }

    willReceiveProps (newProps) {
      let config = this._compileManagedProps(newProps)
      let props = this._deriveManagedProps(newProps)
      if (!this._config && config) {
        this._register()
      } else if (this._config && !config) {
        this._deregister()
      }
      this._config = config
      this._props = props
    }

    dispose () {
      this.context.appState.off(this)
    }

    render ($$) {
      return $$(ComponentClass, this._props).ref('managed')
    }

    _register () {
      const { stage, names } = this._config
      this.context.appState.addObserver(names, this._onUpdate, this, { stage })
    }

    _deregister () {
      this.context.appState.off(this)
    }

    _onUpdate () {
      this._props = this._deriveManagedProps()
      this.refs.managed.extendProps(this._props)
    }

    _compileManagedProps (props) {
      let stage = 'render'
      let names = props.bindings || []
      if (names.length > 0) {
        return { stage, names }
      } else {
        return null
      }
    }

    _deriveManagedProps (props) {
      const state = this.context.appState
      const config = this._config
      if (config) {
        let derivedProps = Object.assign({}, props)
        delete derivedProps.bindings
        config.names.forEach(name => {
          derivedProps[name] = state.get(name)
        })
        return derivedProps
      } else {
        return props
      }
    }
  }

  _ManagedComponentCache.set(ComponentClass, ManagedComponent)

  return ManagedComponent
}
