import { Component } from 'substance'

/*
  Renders a text property as plain text into a `<span>` and rerenders on changes.
*/
export default class PlainTextComponent extends Component {
  didMount () {
    const path = this.props.path
    this.context.editorSession.onRender('document', this.rerender, this, { path })
  }

  dispose () {
    this.context.editorSession.off(this)
  }

  render ($$) {
    const doc = this.context.editorSession.getDocument()
    const text = doc.get(this.props.path)
    return $$('span').append(text)
  }
}
