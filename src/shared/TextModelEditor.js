import StringModelEditor from './StringModelEditor'

export default class TextModelEditor extends StringModelEditor {
  render ($$) {
    return super.render($$).addClass('sc-text-model-editor')
  }
}
