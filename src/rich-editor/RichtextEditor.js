import { AbstractEditor, TextPropertyEditor } from 'substance'

class RichtextEditor extends AbstractEditor {
  render($$) {
    let el = $$('div').addClass('sc-richtext-editor')

    el.append(
      $$(TextPropertyEditor, {
        path: ['html-content', 'content']
      }).ref('body')
    )
    return el
  }
}

export default RichtextEditor
