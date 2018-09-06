import { DefaultDOMElement } from 'substance'
import { Managed } from '../../kit'
import EditorPanel from '../shared/EditorPanel'
import ManuscriptModel from '../models/ManuscriptModel'
import TOCProvider from './TOCProvider'
import TOC from './TOC'

export default class ManuscriptEditor extends EditorPanel {
  getActionHandlers () {
    return Object.assign(super.getActionHandlers(), {
      tocEntrySelected: this._tocEntrySelected
    })
  }

  _initialize (props) {
    super._initialize(props)

    this.model = new ManuscriptModel(this.api)
    this.tocProvider = this._getTOCProvider()
    this.context.tocProvider = this.tocProvider
  }

  didMount () {
    super.didMount()

    this.tocProvider.on('toc:updated', this._showHideTOC, this)
    this._showHideTOC()
    this._restoreViewport()

    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  didUpdate () {
    super.didUpdate()

    this._showHideTOC()
    this._restoreViewport()
  }

  dispose () {
    super.dispose()

    this.tocProvider.off(this)
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  render ($$) {
    let el = $$('div').addClass('sc-manuscript-editor')
      // sharing styles with sc-article-reader
      .addClass('sc-manuscript-view')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    el.on('keydown', this._onKeydown)
    return el
  }

  _renderMainSection ($$) {
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$),
        this._renderFooterPane($$)
      ).ref('contentSection')
    )

    if (appState.workflowId) {
      let Modal = this.getComponent('modal')
      let WorkflowComponent = this.getComponent(appState.workflowId)
      let workflowModal = $$(Modal).addClass('se-workflow-modal sm-workflow-' + appState.workflowId).append(
        $$(WorkflowComponent, appState.workflowProps).ref('workflow')
      )
      mainSection.append(workflowModal)
    }

    return mainSection
  }

  _renderTOCPane ($$) {
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    el.append(
      $$('div').addClass('se-context-pane-content').append(
        $$(TOC)
      )
    )
    return el
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    const configurator = this._getConfigurator()
    const toolPanel = configurator.getToolPanel('toolbar', true)
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        toolPanel,
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderContentPanel ($$) {
    const configurator = this._getConfigurator()
    const ScrollPane = this.getComponent('scroll-pane')
    const ManuscriptComponent = this.getComponent('manuscript')
    const Overlay = this.getComponent('overlay')
    const ContextMenu = this.getComponent('context-menu')
    const Dropzones = this.getComponent('dropzones')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      // scrollbarType: 'substance',
      contextMenu: 'custom',
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    contentPanel.append(
      $$(ManuscriptComponent, {
        model: this.model,
        disabled: this.props.disabled
      }).ref('article'),
      $$(Managed(Overlay), {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: this._getTheme(),
        bindings: ['commandStates']
      }),
      $$(Managed(ContextMenu), {
        toolPanel: configurator.getToolPanel('context-menu'),
        theme: this._getTheme(),
        bindings: ['commandStates']
      }),
      $$(Dropzones)
    )
    return contentPanel
  }

  _renderFooterPane ($$) {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    let el = $$('div').addClass('se-footer-pane')
    el.append(
      $$(FindAndReplaceDialog, {
        theme: this._getTheme()
      }).ref('findAndReplace')
    )
    return el
  }

  _renderContextPane ($$) {
    // TODO: we need to revisit this
    // We have introduced this to be able to inject a shared context panel
    // in Stencila. However, ATM we try to keep the component
    // as modular as possible, and avoid these kind of things.
    if (this.props.contextComponent) {
      let el = $$('div').addClass('se-context-pane')
      el.append(
        $$('div').addClass('se-context-pane-content').append(
          this.props.contextComponent
        )
      )
      return el
    }
  }

  _getContentPanel () {
    return this.refs.contentPanel
  }

  getViewport () {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  _restoreViewport () {
    const editorSession = this._getEditorSession()
    if (this.props.viewport) {
      this.refs.contentPanel.setScrollPosition(this.props.viewport.x)
    }
    // HACK: This should work without a timeout, however it seems that
    // Editor.didMount is called earlier than the didMounts of the different
    // surfaces which do the surface registering, required here.
    setTimeout(() => {
      // We also use this place to rerender the selection
      let focusedSurface = editorSession.getFocusedSurface()
      if (focusedSurface) {
        focusedSurface.rerenderDOMSelection()
      }
    })
  }

  _tocEntrySelected (nodeId) {
    const node = this._getDocument().get(nodeId)
    const editorSession = this._getEditorSession()
    const nodeComponent = this._getContentPanel().find(`[data-id="${nodeId}"]`)
    if (nodeComponent) {
      // TODO: it needs to be easier to retrieve the surface
      let surface = nodeComponent.context.surface
      // There are cases when we can't set selection, e.g. for references
      if (surface) {
        // Note: in this case we do not need to scroll explicitly because this will be done by the SurfaceManager
        editorSession.setSelection({
          type: 'property',
          path: node.getPath(),
          startOffset: 0,
          surfaceId: surface.id,
          containerId: surface.getContainerId()
        })
      } else {
        return this._scrollElementIntoView(nodeComponent.el)
      }
    }
  }

  _showHideTOC () {
    let contentSectionWidth = this.refs.contentSection.el.width
    if (!this._isTOCVisible() || contentSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }

  _isTOCVisible () {
    let entries = this.tocProvider.getEntries()
    return entries.length >= 2
  }

  _getTOCProvider () {
    return new TOCProvider(this.editorSession, { containerId: 'body' })
  }
}
