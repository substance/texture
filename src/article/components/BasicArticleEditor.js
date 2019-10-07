import { DefaultDOMElement, $$ } from 'substance'
import { Managed, OverlayCanvas } from '../../kit'
import EditorPanel from './EditorPanel'

/**
 * To implement a specific editor:
 * - override _renderManuscript() to provide a display/editor for a specific article type
 * - override _renderTOC() for that specific article type
 * - provide a 'toolbar' tool-panel specification via Configurator
 * - provide a 'context-menu' tool-panel specification via Configurator
 */
export default class BasicArticleEditor extends EditorPanel {
  getActionHandlers () {
    return {
      acquireOverlay: this._acquireOverlay,
      releaseOverlay: this._releaseOverlay
    }
  }

  didMount () {
    super.didMount()

    this._showHideTOC()
    this._restoreViewport()

    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
    this.context.editorSession.setRootComponent(this._getContentPanel())
  }

  didUpdate () {
    super.didUpdate()

    this._showHideTOC()
    this._restoreViewport()
  }

  dispose () {
    super.dispose()

    DefaultDOMElement.getBrowserWindow().off(this)
  }

  _renderTOC () {
    // Table of contents implementation can not be generalized
    // override this method to render a TOC component
  }

  _renderManuscript () {
    // depending on the specific article type, the manuscript
    // needs to be rendered differently
    // override this method to provide a specific implementation
  }

  _getClass () {
    return 'sc-article-editor'
  }

  render () {
    const appState = this.context.editorState

    const el = $$('div', { class: this._getClass() },
      $$('div', { class: 'se-main-section' },
        this._renderToolbar(),
        $$('div', { class: 'se-content-section' },
          this._renderTOCPane(),
          this._renderContentPanel()
        ).ref('contentSection'),
        this._renderFooterPane(),
        appState.workflowId
          ? this._renderWorkflow(appState.workflowId)
          : null
      )
    )
    el.on('keydown', this._onKeydown)
    return el
  }

  _renderToolbar () {
    const Toolbar = this.getComponent('toolbar')
    const configurator = this._getConfigurator()
    // ATTENTION: a toolpanel 'toolbar' has to be configured via Configurator
    const items = configurator.getToolPanel('toolbar', true)

    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        items,
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderTOCPane () {
    const el = $$('div').addClass('se-toc-pane')
    el.append(
      $$('div').addClass('se-context-pane-content').append(
        this._renderTOC()
      )
    )
    return el
  }

  _renderContentPanel () {
    const ScrollPane = this.getComponent('scroll-pane')
    const contentPanel = $$(ScrollPane, {
      contextMenu: 'custom',
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    contentPanel.append(
      this._renderManuscript(),
      this._renderOverlayCanvas(),
      this._renderContextMenu()
    )
    return contentPanel
  }

  _renderOverlayCanvas () {
    return $$(OverlayCanvas, {
      theme: this._getTheme(),
      panelProvider: () => this.refs.contentPanel
    }).ref('overlay')
  }

  _renderContextMenu () {
    const configurator = this._getConfigurator()
    const ContextMenu = this.getComponent('context-menu')
    // ATTENTION:
    const items = configurator.getToolPanel('context-menu')
    return $$(Managed(ContextMenu), {
      items,
      theme: this._getTheme(),
      bindings: ['commandStates']
    })
  }

  _renderFooterPane () {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    const el = $$('div').addClass('se-footer-pane')
    el.append(
      $$(FindAndReplaceDialog, {
        theme: this._getTheme(),
        viewName: 'manuscript'
      }).ref('findAndReplace')
    )
    return el
  }

  _renderWorkflow (workflowId) {
    let workflowProps = this.context.editorState.workflowProps || {}
    let Modal = this.getComponent('modal')
    let WorkflowComponent = this.getComponent(workflowId)
    return $$(Modal, {
      width: WorkflowComponent.desiredWidth,
      content: $$(WorkflowComponent, workflowProps).ref('workflow')
    }).addClass('se-workflow-modal sm-workflow-' + workflowId)
  }

  _getContentPanel () {
    return this.refs.contentPanel
  }

  getViewport () {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  _showHideTOC () {
    const contentSectionWidth = this.refs.contentSection.el.width
    if (contentSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }

  _acquireOverlay (...args) {
    this.refs.overlay.acquireOverlay(...args)
  }

  _releaseOverlay (...args) {
    this.refs.overlay.releaseOverlay(...args)
  }
}
