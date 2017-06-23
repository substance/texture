import { NodeComponent } from 'substance'

class FnGroupComponent extends NodeComponent {

  didMount() {
    super.didMount()
    this.context.labelGenerator.on('labels:generated', this._onLabelsChanged, this)
  }

  dispose() {
    super.dispose()
    this.context.labelGenerator.off(this)
  }

  render($$) {
    const labelGenerator = this.context.labelGenerator
    const node = this.props.node

    let el = $$('div').addClass('sc-fn-group').append(
      $$('div').addClass('se-title').append('Footnotes')
    )


    let fns = node.findAll('fn')
    let entries = fns.map((fn) => {
      return {
        pos: labelGenerator.getPosition('fn', fn.id) || Number.MAX_VALUE,
        fn
      }
    })
    entries.sort((a,b) => {
      return a.pos - b.pos
    })
    entries.forEach((entry) => {
      const fn = entry.fn
      let FnComponent = this.getComponent('fn')
      el.append(
        $$(FnComponent, { node: fn })
      )
    })

    el.append(
      $$('a').attr({href: '#'})
        .append('Add Footnote')
        .on('click', this._addFn)
    )
    return el
  }

  _onLabelsChanged(refType) {
    if (refType === 'fn') {
      this.rerender()
    }
  }

  /*
    Insert new Footnote

    <fn id="fn2">
      <p>Please enter footnote content</p>
    </fn>
  */
  _addFn() {
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let fnGroup = doc.find('fn-group')
      let fn = doc.createElement('fn')
      let fnPlaceholder = doc.createElement('p').setTextContent('Please enter footnote content')
      fn.append(fnPlaceholder)
      fnGroup.append(fn)
    })
    this.rerender()
  }
}


export default FnGroupComponent
