import { AbstractEditor, TextPropertyEditor } from 'substance'

class RichtextEditor extends AbstractEditor {
  render($$) {
    let el = $$('div').addClass('sc-richtext-editor')
    let BodyScrollPane = this.getComponent('body-scroll-pane')
    let Overlay = this.getComponent('overlay')
    let configurator = this.getConfigurator()

    // TODO: there must be a more elegant solution than wrapping every
    // RichtTextEditor widget into a fake BodyScrollPane
    el.append(
      $$(BodyScrollPane).append(
        $$(TextPropertyEditor, {
          path: ['body', 'content']
        }).ref('body'),
        $$(Overlay, {
          toolPanel: configurator.getToolPanel('main-overlay'),
          theme: 'dark'
        })
      )
    )
    return el
  }
}

export default RichtextEditor
