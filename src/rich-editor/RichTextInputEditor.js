import { AbstractEditor, ContainerEditor } from 'substance'

class RichTextInputEditor extends AbstractEditor {

  didMount() {
    let scrollPane = this.context.scrollPane
    let Overlay = this.componentRegistry.get('overlay')
    let Dropzones = this.componentRegistry.get('dropzones')

    this.overlay = new Overlay(this, {
      toolGroups: ['annotations', 'text', 'overlay']
    }).mount(scrollPane.el)

    this.dropzones = new Dropzones(this, {}).mount(scrollPane.el)
  }

  dispose() {
    this.overlay.remove()
    this.dropzones.remove()
  }

  render($$) {
    let el = $$('div').addClass('sc-rich-text-input-editor')
    let configurator = this.getConfigurator()

    el.append(
      $$(ContainerEditor, {
        disabled: this.props.disabled,
        editorSession: this.editorSession,
        node: this.doc.get('body'),
        commands: configurator.getSurfaceCommandNames(),
        textTypes: configurator.getTextTypes()
      }).ref('body')
    )
    return el
  }
}

export default RichTextInputEditor
