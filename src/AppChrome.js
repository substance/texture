import { Component, DefaultDOMElement, platform } from 'substance'

export default class AppChrome extends Component {
  didMount () {
    // when the developer console is not open, display when there is an error
    if (!platform.devtools) {
      try {
        this._init().catch(error => {
          console.error(error)
          this.setState({error})
        })
      } catch (error) {
        console.error(error)
        this.setState({error})
      }
    } else {
      this._init()
    }

    DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this)
    DefaultDOMElement.getBrowserWindow().on('drop', this._supressDnD, this)
    DefaultDOMElement.getBrowserWindow().on('dragover', this._supressDnD, this)
  }

  dispose() {
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  getChildContext() {
    return this._childContext
  }

  getInitialState() {
    return {
      archive: undefined,
      error: undefined
    }
  }

  /*
    4 initialisation stages

    - _setupChildContext
    - _initContext
    - _loadArchive
    - _initArchive
  */
  async _init() {
    // TODO: do we really need to separated the first two steps?
    let childContext = await this._setupChildContext()
    await this._initContext(childContext)
    let archive = await this._loadArchive(this.props.archiveId, childContext)
    archive = await this._initArchive(archive, childContext)
    this._childContext = childContext
    this._afterInit()
    this.setState({archive})
  }

  async _setupChildContext() {
    return {}
  }

  async _initContext(context) {
    return context
  }

  async _loadArchive() {
    throw new Error('_loadArchive not implemented')
  }

  async _initArchive(archive) {
    return archive
  }

  _afterInit() {}

  /*
    We may want an explicit save button, that can be configured on app level,
    but passed down to editor toolbars.
  */
  _save() {
    return this.state.archive.save().then(() => {
      this._updateTitle(false)
    }).catch(err => {
      console.error(err)
    })
  }

  _updateTitle() {
    // no-op
  }

  _keyDown(event) {
    if ( event.key === 'Dead' ) return
    if (this._handleKeyDown) {
      this._handleKeyDown(event)
    }
  }

  _supressDnD(event) {
    event.preventDefault()
  }
}
