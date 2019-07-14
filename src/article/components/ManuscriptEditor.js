import { DefaultDOMElement } from 'substance'
import { Managed, OverlayCanvas } from '../../kit'
import EditorPanel from './EditorPanel'
import ManuscriptTOC from './ManuscriptTOC'

export default class ManuscriptEditor extends EditorPanel {
  _initialize (props) {
    super._initialize(props)

    this._model = this.context.api.getArticleModel()
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
        this._renderContentPanel($$)
      // TODO: this component has always the same structure and should preserve all elements, event without ref
      ).ref('contentSection'),
      this._renderFooterPane($$)
    )

    if (appState.workflowId) {
      mainSection.append(
        this._renderWorkflow($$, appState.workflowId)
      )
    }

    return mainSection
  }

  _renderTOCPane ($$) {
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    el.append(
      $$('div').addClass('se-context-pane-content').append(
        $$(ManuscriptTOC, { model: this._model })
      )
    )
    return el
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    const configurator = this._getConfigurator()
    const items = configurator.getToolPanel('toolbar', true)
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        items,
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderContentPanel ($$) {
    const ScrollPane = this.getComponent('scroll-pane')
    const ManuscriptComponent = this.getComponent('manuscript')
    let contentPanel = $$(ScrollPane, {
      contextMenu: 'custom',
      scrollbarPosition: 'right'
    // NOTE: this ref is needed to access the root element of the editable content
    }).ref('contentPanel')

    contentPanel.append(
      $$(ManuscriptComponent, {
        model: this._model,
        disabled: this.props.disabled
      }).ref('article'),
      this._renderMainOverlay($$),
      this._renderContextMenu($$)
    )
    return contentPanel
  }

  _renderMainOverlay ($$) {
    const panelProvider = () => this.refs.contentPanel
    return $$(OverlayCanvas, {
      theme: this._getTheme(),
      panelProvider
    }).ref('overlay')
  }

  _renderContextMenu ($$) {
    const configurator = this._getConfigurator()
    const ContextMenu = this.getComponent('context-menu')
    const items = configurator.getToolPanel('context-menu')
    return $$(Managed(ContextMenu), {
      items,
      theme: this._getTheme(),
      bindings: ['commandStates']
    })
  }

  _renderFooterPane ($$) {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    let el = $$('div').addClass('se-footer-pane')
    el.append(
      $$(FindAndReplaceDialog, {
        theme: this._getTheme(),
        viewName: 'manuscript'
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

  _showHideTOC () {
    let contentSectionWidth = this.refs.contentSection.el.width
    if (contentSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }
}
